import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Function to search the web for company information
async function searchWeb(query: string): Promise<string> {
  try {
    const serperApiKey = process.env.SERPER_API_KEY;
    if (!serperApiKey) {
      return "Web search not available - Serper API key not configured.";
    }

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 5
      })
    });

    if (!response.ok) {
      return "Web search temporarily unavailable.";
    }

    const data = await response.json();
    
    // Extract relevant information from search results
    let searchSummary = "Web search results:\n";
    
    if (data.organic && data.organic.length > 0) {
      data.organic.slice(0, 3).forEach((result: any, index: number) => {
        searchSummary += `${index + 1}. ${result.title}\n   ${result.snippet}\n   Source: ${result.link}\n\n`;
      });
    }
    
    if (data.knowledgeGraph) {
      searchSummary += "Key Information:\n";
      if (data.knowledgeGraph.description) {
        searchSummary += `Description: ${data.knowledgeGraph.description}\n`;
      }
      if (data.knowledgeGraph.attributes) {
        Object.entries(data.knowledgeGraph.attributes).forEach(([key, value]) => {
          searchSummary += `${key}: ${value}\n`;
        });
      }
    }

    return searchSummary;
  } catch (error) {
    console.error('Web search error:', error);
    return "Web search failed due to technical issues.";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { company, message } = await req.json();
    console.log('Received request:', { company, message });
    if (!company || !message) {
      console.error('Missing company or message');
      return NextResponse.json({ error: 'Missing company or message' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('Groq API key not set');
      return NextResponse.json({ error: 'Groq API key not set. Please add GROQ_API_KEY to your .env.local file.' }, { status: 500 });
    }

    // Determine if we need to search the web based on the question
    const needsWebSearch = !message.toLowerCase().includes('employee') && 
                          !message.toLowerCase().includes('founded') && 
                          !message.toLowerCase().includes('industry') && 
                          !message.toLowerCase().includes('location') &&
                          (message.toLowerCase().includes('founder') ||
                           message.toLowerCase().includes('ceo') ||
                           message.toLowerCase().includes('news') ||
                           message.toLowerCase().includes('recent') ||
                           message.toLowerCase().includes('competitor') ||
                           message.toLowerCase().includes('funding') ||
                           message.toLowerCase().includes('revenue') ||
                           message.toLowerCase().includes('good fit') ||
                           message.toLowerCase().includes('recommend') ||
                           message.toLowerCase().includes('should') ||
                           !Object.values(company).some(val => 
                             typeof val === 'string' && val.toLowerCase().includes(message.toLowerCase().split(' ')[0])
                           ));

    let webSearchResults = "";
    if (needsWebSearch) {
      console.log('Performing web search for:', company.name);
      const searchQuery = `${company.name} company ${message.toLowerCase().includes('founder') ? 'founder CEO' : ''} ${message.toLowerCase().includes('funding') ? 'funding investment' : ''} ${message.toLowerCase().includes('news') ? 'recent news' : ''}`;
      webSearchResults = await searchWeb(searchQuery);
      console.log('Web search results:', webSearchResults);
    }

    // Enhanced system prompt for better analysis
    const systemPrompt = `You are an expert business analyst and sales intelligence assistant. You help sales teams by providing comprehensive company analysis, strategic insights, and actionable recommendations.

    Your capabilities include:
    - Analyzing company data for sales fit and opportunity assessment
    - Providing strategic recommendations for outreach and engagement
    - Combining internal data with external market intelligence
    - Offering insights on company culture, leadership, and business prospects

    Always provide specific, actionable insights rather than just restating data.`;

    // Compose the enhanced prompt with company context and web search results
    let prompt = `Company Data from Internal Database:
${JSON.stringify(company, null, 2)}

User Question: ${message}`;

    if (webSearchResults && webSearchResults !== "Web search not available - Serper API key not configured.") {
      prompt += `\n\nAdditional Information from Web Search:
${webSearchResults}`;
    }

    prompt += `\n\nPlease provide a comprehensive answer that:
1. Uses both the internal company data and any web search results
2. Provides strategic insights and analysis, not just facts
3. Offers actionable recommendations when relevant
4. Is specific and tailored to this company
5. Considers sales and business development context

Answer in a helpful, insightful, and professional manner.`;

    console.log('Enhanced prompt:', prompt);

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!groqRes.ok) {
      const error = await groqRes.text();
      console.error('Groq API error:', error);
      return NextResponse.json({ error: 'Groq API error: ' + error }, { status: 500 });
    }

    const data = await groqRes.json();
    console.log('Groq response:', data);
    const answer = data.choices?.[0]?.message?.content?.trim() || 'No answer generated.';
    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error('Handler error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 