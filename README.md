# MatchIt! - Sales Intelligence Dashboard

A modern sales intelligence platform built with Next.js 14, React 18, TypeScript, and Tailwind CSS. MatchIt! helps sales teams identify decision-makers by merging company and people datasets with advanced scoring algorithms.

## Features

- **Data Upload & Processing**: Upload CSV files for companies and people data
- **Intelligent Matching**: Advanced algorithms to match contacts with companies
- **Scoring System**: Sales fit scoring and priority classification
- **Interactive Dashboard**: Real-time statistics and visualizations
- **Geographic Mapping**: Company locations with clustering and geocoding
- **Advanced Filtering**: Multi-criteria filtering and search functionality
- **Job Postings Integration**: View current software engineering job postings for companies
- **Responsive Design**: Modern, mobile-friendly interface

## Job Postings Feature

The app now includes a job postings feature that displays current software engineering job openings for companies in the dataset. When you click "View Details" for a company, you'll see:

- **Company Contacts**: All contacts associated with the company
- **Job Postings**: Current software engineering job openings with:
  - Job title and location
  - Salary information
  - Job type and experience requirements
  - Required skills
  - Direct links to apply
  - Posted date

### Current Implementation

The app currently uses mock data for demonstration purposes. The job postings are stored in `utils/jobService.ts` and include sample data for:
- TechCorp Solutions
- DataFlow Systems  
- InnovateTech Inc

### Integrating Real Job APIs

To integrate with real job posting APIs, you can modify the `fetchJobPostingsFromAPI` function in `utils/jobService.ts`. Here are some options:

#### Indeed API
```typescript
// You'll need to sign up for Indeed's API
const response = await fetch(`https://api.indeed.com/v2/jobs?query=software+engineer&company=${encodeURIComponent(companyName)}`, {
  headers: {
    'Authorization': `Bearer ${YOUR_INDEED_API_KEY}`,
    'Content-Type': 'application/json'
  }
});
```

#### LinkedIn Jobs API
```typescript
// LinkedIn requires OAuth 2.0 authentication
const response = await fetch(`https://api.linkedin.com/v2/jobs?keywords=software+engineer&company=${encodeURIComponent(companyName)}`, {
  headers: {
    'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});
```

#### Alternative: Web Scraping
For companies without public APIs, you could implement web scraping using libraries like Puppeteer or Cheerio to extract job postings from company career pages.

### Environment Variables

If you integrate real APIs, add your API keys to a `.env.local` file:

```env
INDEED_API_KEY=your_indeed_api_key
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet.js with OpenStreetMap
- **Data Processing**: PapaParse for CSV parsing
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Data Format

### Companies CSV
Required columns: `id`, `name`
Optional columns: `website`, `industry`, `employee_count`, `revenue`, `founded`, `city`, `state`, `country`, `zip_code`, `phone`, `description`, `linkedin_url`, `crunchbase_url`, `technologies`, `funding`, `last_updated`

### People CSV
Required columns: `id`, `first_name`, `last_name`, `full_name`, `title`, `company`
Optional columns: `email`, `phone`, `linkedin_url`, `department`, `seniority`, `location`, `last_updated`, `decision_maker`, `contact_score`

## Deployment

The app is fully client-side and can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your GitHub repository
- **GitHub Pages**: Configure for static export

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Built with ❤️ by Angad Dhillon**
