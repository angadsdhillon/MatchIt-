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

### Real API Integration

The app now supports real job posting APIs with automatic fallback to mock data. See `ENV_SETUP.md` for complete setup instructions.

#### Currently Integrated APIs:

1. **Adzuna API** (Free tier available)
   - 1,000 requests/month free
   - Sign up at https://developer.adzuna.com/
   - Provides salary, location, and detailed job info

2. **GitHub Jobs API** (Free, deprecated but accessible)
   - No API key required
   - Limited data but good for testing

3. **Web Scraping** (Via Next.js API route)
   - Scrapes company career pages
   - Bypasses CORS restrictions
   - Extensible for custom company pages

#### Quick Setup:

1. Create `.env.local` file:
```env
NEXT_PUBLIC_ADZUNA_APP_ID=your_app_id_here
NEXT_PUBLIC_ADZUNA_API_KEY=your_api_key_here
```

2. Restart the development server
3. Upload sample data and test job postings

#### API Priority:
1. Adzuna API (if configured)
2. GitHub Jobs API
3. Web scraping via `/api/jobs`
4. Mock data (fallback)

### Environment Variables

Required for real API integration:

```env
# Adzuna API (Recommended - Free tier available)
NEXT_PUBLIC_ADZUNA_APP_ID=your_adzuna_app_id
NEXT_PUBLIC_ADZUNA_API_KEY=your_adzuna_api_key

# Web Scraping Services (Optional)
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key
BRIGHT_DATA_API_KEY=your_bright_data_api_key
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
