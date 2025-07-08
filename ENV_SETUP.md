# Environment Setup for Real Job APIs

To integrate real job posting data, create a `.env.local` file in your project root with the following API keys:

## Free APIs (Recommended to start)

### Adzuna API
- **Sign up**: https://developer.adzuna.com/
- **Free tier**: 1,000 requests/month
- **Setup**: 
  ```env
  NEXT_PUBLIC_ADZUNA_APP_ID=your_app_id_here
  NEXT_PUBLIC_ADZUNA_API_KEY=your_api_key_here
  ```

### GitHub Jobs API
- **Status**: Deprecated but still accessible
- **Free**: No API key required
- **Limitations**: Limited job data, no salary info

## Paid APIs (For production use)

### ZipRecruiter API
- **Cost**: $99/month for 10,000 requests
- **Setup**:
  ```env
  ZIPRECRUITER_API_KEY=your_api_key_here
  ```

### Glassdoor API
- **Cost**: Contact sales
- **Setup**:
  ```env
  GLASSDOOR_API_KEY=your_api_key_here
  ```

## Web Scraping Services

### ScrapingBee
- **Cost**: $29/month for 1,000 requests
- **Use case**: Scrape company career pages
- **Setup**:
  ```env
  SCRAPINGBEE_API_KEY=your_api_key_here
  ```

### Bright Data
- **Cost**: $500/month for 40GB
- **Use case**: Large-scale web scraping
- **Setup**:
  ```env
  BRIGHT_DATA_API_KEY=your_api_key_here
  ```

## LinkedIn API (Limited Access)

**Note**: LinkedIn's Jobs API is very restricted and requires:
- Business verification
- OAuth 2.0 setup
- Special approval from LinkedIn
- Primarily for posting jobs, not searching

```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

## Complete .env.local Example

```env
# Adzuna API (Recommended for testing)
NEXT_PUBLIC_ADZUNA_APP_ID=your_adzuna_app_id_here
NEXT_PUBLIC_ADZUNA_API_KEY=your_adzuna_api_key_here

# Web Scraping (For company career pages)
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key_here

# Paid Job APIs (For production)
ZIPRECRUITER_API_KEY=your_ziprecruiter_api_key_here
GLASSDOOR_API_KEY=your_glassdoor_api_key_here
```

## How It Works

1. **Priority Order**: The app tries APIs in this order:
   - Adzuna API (free, good coverage)
   - GitHub Jobs API (free, limited)
   - Web scraping via API route
   - Mock data (fallback)

2. **Fallback**: If no real data is found, the app shows mock data for demonstration

3. **Caching**: Consider implementing caching to avoid hitting API limits

## Testing

1. Set up your API keys in `.env.local`
2. Restart your development server
3. Upload sample data and click "View Details" on companies
4. Check browser console for API response logs 