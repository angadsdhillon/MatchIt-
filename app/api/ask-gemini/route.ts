import { NextRequest, NextResponse } from 'next/server';

// Function to search the web for current information
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
      console.error('Serper API error:', response.status, response.statusText);
      return "Web search temporarily unavailable.";
    }

    const data = await response.json();
    
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
  const { message, conversationHistory = [] } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  console.log('Gemini API Key exists:', !!apiKey);
  console.log('Message received:', message);
  console.log('Conversation history length:', conversationHistory.length);

  if (!apiKey) {
    console.log('No API key found');
    return NextResponse.json({ error: 'Gemini API key not set.' }, { status: 500 });
  }

  if (!message) {
    return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
  }

  try {
    // IMPROVED web search detection - more intelligent and comprehensive
    const needsWebSearch = 
      // Time-based triggers
      message.toLowerCase().includes('recent') ||
      message.toLowerCase().includes('latest') ||
      message.toLowerCase().includes('news') ||
      message.toLowerCase().includes('current') ||
      message.toLowerCase().includes('today') ||
      message.toLowerCase().includes('now') ||
      message.toLowerCase().includes('update') ||
      message.toLowerCase().includes('change') ||
      // Company-specific triggers
      message.toLowerCase().includes('ceo') ||
      message.toLowerCase().includes('founder') ||
      message.toLowerCase().includes('founded') ||
      message.toLowerCase().includes('employee') ||
      message.toLowerCase().includes('revenue') ||
      message.toLowerCase().includes('funding') ||
      message.toLowerCase().includes('competitor') ||
      // Business intelligence triggers
      message.toLowerCase().includes('company') ||
      message.toLowerCase().includes('business') ||
      message.toLowerCase().includes('industry') ||
      message.toLowerCase().includes('market') ||
      // Comparison and recommendation triggers
      message.toLowerCase().includes('best') ||
      message.toLowerCase().includes('top') ||
      message.toLowerCase().includes('compare') ||
      message.toLowerCase().includes('recommend') ||
      message.toLowerCase().includes('which') ||
      // General information triggers
      message.toLowerCase().includes('what') ||
      message.toLowerCase().includes('who') ||
      message.toLowerCase().includes('where') ||
      message.toLowerCase().includes('when') ||
      message.toLowerCase().includes('how');

    console.log('Web search needed?', needsWebSearch);
    console.log('Message:', message);

    let webSearchResults = "";
    if (needsWebSearch) {
      console.log('Performing web search for:', message);
      let searchQuery = message;
      
      // Extract company name if mentioned in conversation history
      let companyName = "";
      if (conversationHistory.length > 0) {
        const recentMessages = conversationHistory.slice(-3);
        for (const msg of recentMessages) {
          if (msg.sender === 'user') {
            const words = msg.text.split(' ');
            for (let i = 0; i < words.length; i++) {
              if (words[i].match(/^[A-Z][a-z]+/) && !['What', 'Who', 'Where', 'When', 'How', 'Why', 'The', 'About', 'Their', 'This', 'That'].includes(words[i])) {
                companyName = words[i];
                if (i + 1 < words.length && words[i + 1].match(/^[A-Z][a-z]+/)) {
                  companyName += ' ' + words[i + 1];
                }
                break;
              }
            }
            if (companyName) break;
          }
        }
      }
      
      if (companyName) {
        searchQuery = `${companyName} company ${message}`;
      } else {
        // For general questions, add context to make search more effective
        if (message.toLowerCase().includes('best') || message.toLowerCase().includes('top')) {
          searchQuery = `${message} companies 2024 current information`;
        } else if (message.toLowerCase().includes('what') || message.toLowerCase().includes('which')) {
          searchQuery = `${message} current information latest`;
        } else {
          searchQuery = `${message} current information`;
        }
      }
      
      console.log('Search query:', searchQuery);
      webSearchResults = await searchWeb(searchQuery);
      console.log('Web search results length:', webSearchResults.length);
      console.log('Web search results preview:', webSearchResults.substring(0, 200));
    } else {
      console.log('Web search not triggered for this message');
    }

    // Build conversation context
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = "Previous conversation:\n";
      conversationHistory.forEach((msg: any, index: number) => {
        conversationContext += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
      conversationContext += "\n";
    }

    // Enhanced system prompt for better context awareness
    const systemPrompt = `You are an intelligent AI assistant with access to web search results and conversation history. 
    
Your capabilities:
- Remember and reference previous conversation context
- Use web search results for current/real-time information
- Provide accurate, up-to-date answers
- Give concise but comprehensive responses
- If asked about companies, use the most current information available
- Understand follow-up questions and maintain context from previous messages
- When web search results are provided, prioritize that information over your training data
- For company information (founding date, employee count, revenue, etc.), always use the web search results if available

IMPORTANT: When answering follow-up questions, use the context from the previous conversation. If someone asks "What about their CEO?" after asking about a company, understand they're referring to the same company.

When web search results are provided, use that information as your primary source for answering the question. Only fall back to your training data if the web search doesn't provide relevant information.

Always consider the conversation history and any provided web search results when formulating your response.`;

    // Build the full prompt with context
    let fullPrompt = `${systemPrompt}\n\n${conversationContext}Current question: ${message}`;

    if (webSearchResults && webSearchResults !== "Web search not available - Serper API key not configured.") {
      fullPrompt += `\n\nWeb search results for current information:\n${webSearchResults}`;
    }

    fullPrompt += `\n\nPlease provide an accurate, concise answer based on the conversation context and any available web search results. If this is a follow-up question, make sure to reference the context from the previous conversation.`;

    console.log('Making request to Gemini API...');
    
    // Use the CORRECT Gemini API format without invalid tools field
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    console.log('Gemini response status:', geminiRes.status);

    if (!geminiRes.ok) {
      const error = await geminiRes.json();
      console.log('Gemini API error:', error);
      return NextResponse.json({ error: error.error?.message || 'Gemini API error' }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    console.log('Gemini response received');
    const answer = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer from Gemini.';
    
    return NextResponse.json({ answer });
  } catch (err: any) {
    console.log('Exception caught:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 