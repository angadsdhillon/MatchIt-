# MatchIt Sales Intelligence Dashboard - Handover Document

## Overview

MatchIt is a comprehensive sales intelligence dashboard built with Next.js that helps sales teams analyze company and people datasets to identify potential customers and opportunities. The app merges company and contact data, provides AI-powered insights, and offers interactive visualizations for data-driven sales decisions.

## Architecture & Technology Stack

### Core Technologies
- Frontend Framework: Next.js 14 (App Router)
- Language: TypeScript
- UI Library: React 18
- Styling: Tailwind CSS
- Data Visualization: Recharts
- Maps: Leaflet.js with OpenStreetMap
- Data Processing: PapaParse (CSV parsing)
- Animations: Framer Motion
- Icons: Lucide React

### Project Structure
```
MatchIt-/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── ask-ai/        # Groq AI integration
│   │   ├── ask-gemini/    # Google Gemini AI integration
│   │   └── jobs/          # Job postings API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Charts.tsx         # Data visualizations
│   ├── ChatAI.tsx         # Company-specific AI chat
│   ├── CompanyMap.tsx     # Interactive map
│   ├── DashboardStats.tsx # Statistics cards
│   ├── DataTable.tsx      # Data table component
│   ├── DataUpload.tsx     # File upload & processing
│   ├── FilterPanel.tsx    # Data filtering
│   ├── GeminiChat.tsx     # General AI chat
│   └── JobPostings.tsx    # Job listings
├── public/
│   └── sample-data/       # Sample datasets
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── package.json           # Dependencies
```

## CRITICAL: Personal API Keys That Need Replacement

WARNING: The following APIs are currently configured with the original developer's personal accounts and will stop working when transferred. The new developer MUST obtain their own API keys.

### 1. Google Gemini AI (GEMINI_API_KEY)
- Purpose: Powers the "Ask Gemini" chat feature above the filters
- Location: app/api/ask-gemini/route.ts (line 57)
- How to get: 
  1. Go to Google AI Studio (https://makersuite.google.com/app/apikey)
  2. Create a new API key
  3. Add to .env.local: GEMINI_API_KEY=your-key-here
- Features: General AI chat with web search capabilities, conversation memory

### 2. Groq AI (GROQ_API_KEY)
- Purpose: Powers company-specific AI analysis (Ask AI buttons on each company)
- Location: app/api/ask-ai/route.ts (line 67)
- How to get:
  1. Go to Groq Console (https://console.groq.com/)
  2. Sign up and create an API key
  3. Add to .env.local: GROQ_API_KEY=your-key-here
- Features: Company-specific insights, strategic analysis, sales recommendations

### 3. Serper API (SERPER_API_KEY)
- Purpose: Web search functionality for both AI features
- Location: 
  - app/api/ask-ai/route.ts (line 7)
  - app/api/ask-gemini/route.ts (line 5)
- How to get:
  1. Go to Serper.dev (https://serper.dev/)
  2. Sign up and get API key
  3. Add to .env.local: SERPER_API_KEY=your-key-here
- Features: Real-time web search for current company information

### 4. Adzuna API (Optional - Job Postings)
- Purpose: Fetches real job postings for companies
- Location: utils/jobService.ts (lines 4-5)
- How to get:
  1. Go to Adzuna Developer Portal (https://developer.adzuna.com/)
  2. Register and get APP_ID and API_KEY
  3. Add to .env.local:
     ```
     NEXT_PUBLIC_ADZUNA_APP_ID=your-app-id
     NEXT_PUBLIC_ADZUNA_API_KEY=your-api-key
     ```
- Features: Real job postings when viewing company details

## Core Features & Algorithms

### 1. Data Processing Engine
- File: components/DataUpload.tsx
- Algorithm: 
  - CSV parsing with PapaParse
  - Data normalization and validation
  - Smart filtering (companies need name/website/industry; people need name + company/title)
  - Merging company and people datasets
- Key Functions:
  - normalizeCompanyData(): Processes company CSV data
  - normalizePeopleData(): Processes people CSV data
  - processFile(): Main file processing logic

### 2. AI-Powered Insights
- Company-Specific AI (ChatAI.tsx + ask-ai/route.ts):
  - Context-aware company analysis
  - Strategic sales recommendations
  - Web search integration for current data
  - Uses Groq AI with Llama3-8b model

- General AI Chat (GeminiChat.tsx + ask-gemini/route.ts):
  - Expandable chat interface
  - Conversation memory and context
  - Web search for real-time information
  - Uses Google Gemini 1.5 Flash model

### 3. Data Visualization
- Charts (Charts.tsx):
  - Industry distribution pie chart
  - Employee count histogram
  - Geographic distribution
  - Revenue analysis

- Interactive Map (CompanyMap.tsx):
  - Leaflet.js integration
  - Company location plotting
  - Clustered markers for performance

- Statistics Dashboard (DashboardStats.tsx):
  - Key metrics cards
  - Real-time data calculations

### 4. Advanced Filtering
- FilterPanel.tsx:
  - Multi-criteria filtering
  - Dynamic filter options generation
  - Real-time data filtering
  - Export functionality

### 5. Job Intelligence
- JobPostings.tsx + jobService.ts:
  - Real job posting integration
  - Skills extraction from descriptions
  - Company-specific job searches

## Setup Instructions for New Developer

### 1. Environment Setup
```bash
# Clone the repository
git clone [repository-url]
cd MatchIt-

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local  # or create manually
```

### 2. Required Environment Variables
Create .env.local in the project root:
```env
# AI Services (REQUIRED - Get your own keys!)
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
SERPER_API_KEY=your-serper-api-key

# Job Postings (Optional)
NEXT_PUBLIC_ADZUNA_APP_ID=your-adzuna-app-id
NEXT_PUBLIC_ADZUNA_API_KEY=your-adzuna-api-key
```

### 3. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

## Data Format Requirements

### Companies CSV Format
Required columns: id, name
Optional columns: website, industry, employee_count, revenue, founded, city, state, country, zip_code, phone, description, linkedin_url, crunchbase_url, technologies, funding, last_updated

### People CSV Format
Required columns: id, name (or first_name + last_name)
Optional columns: email, title, company, phone, location, linkedin_url, seniority, decision_maker, contact_score

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Netlify: Build command: npm run build
- Self-hosted: Use npm run build && npm start

## Key Files to Understand

### Core Logic
- components/DataUpload.tsx - Data processing and normalization
- components/FilterPanel.tsx - Filtering and search functionality
- components/DataTable.tsx - Data display and interaction

### AI Integration
- app/api/ask-ai/route.ts - Company-specific AI (Groq)
- app/api/ask-gemini/route.ts - General AI chat (Gemini)
- components/ChatAI.tsx - Company AI interface
- components/GeminiChat.tsx - General AI interface

### Data Visualization
- components/Charts.tsx - All chart components
- components/CompanyMap.tsx - Interactive map
- components/DashboardStats.tsx - Statistics cards

## Common Issues & Solutions

### 1. AI Not Working
- Check API keys in .env.local
- Verify API quotas and billing
- Check browser console for errors

### 2. Data Not Loading
- Ensure CSV format matches requirements
- Check file encoding (UTF-8)
- Verify required columns are present

### 3. Performance Issues
- Large datasets (>10,000 rows) may need pagination
- Consider implementing virtual scrolling
- Optimize map clustering for many companies

## Future Enhancement Opportunities

### 1. Advanced AI Features
- Predictive lead scoring
- Automated outreach recommendations
- Sentiment analysis of company data

### 2. Data Integration
- CRM integration (Salesforce, HubSpot)
- LinkedIn Sales Navigator API
- Real-time data updates

### 3. Analytics
- Advanced reporting dashboard
- Custom metric calculations
- Export to PowerPoint/PDF

### 4. Performance
- Server-side pagination
- Data caching
- Optimized queries for large datasets

## Support & Maintenance

### Regular Tasks
- Monitor API usage and costs
- Update dependencies monthly
- Backup sample data files
- Monitor error logs

### Troubleshooting
- Check browser console for client-side errors
- Monitor server logs for API errors
- Verify API key validity and quotas

---

## IMMEDIATE ACTION REQUIRED

Before the app can function properly, the new developer must:

1. Obtain Google Gemini API key
2. Obtain Groq API key  
3. Obtain Serper API key
4. Update .env.local with new keys
5. Test all AI features
6. Verify job postings work (if Adzuna is used)

Without these API keys, the AI features will return errors and the app will not function as intended.

---

This document should be updated as the application evolves. Last updated: [Current Date] 