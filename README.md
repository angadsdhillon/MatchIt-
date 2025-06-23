# PIT Solutions - Sales Intelligence Dashboard

A comprehensive sales intelligence platform that merges company and people datasets to provide actionable insights for sales teams. Transform your Success AI data into powerful sales intelligence with advanced analytics, filtering, and visualization capabilities.

## 🚀 Features

### 📊 **Intelligent Data Merging**
- Automatically match people to companies based on company names
- Smart normalization for better matching accuracy
- Comprehensive data validation and cleaning

### 🎯 **Sales Fit Scoring**
- Advanced algorithm that scores companies based on multiple factors:
  - Company size (preferring medium-sized companies ideal for outsourcing)
  - Contact quality (decision makers, C-suite contacts)
  - Industry alignment (tech companies prioritized)
  - Geographic location (US companies preferred)
  - Contact information completeness

### 📈 **Interactive Dashboard**
- **Overview Tab**: Key metrics, charts, and geographic distribution
- **Companies Tab**: Detailed company and contact information in sortable tables
- **Geographic View**: Interactive map showing company locations with priority indicators
- **Analytics Tab**: Comprehensive charts and data visualizations

### 🔍 **Advanced Filtering & Search**
- Filter by company size, industry, location, contact seniority
- Search across company names and contact information
- Priority-based filtering (High/Medium/Low)
- Real-time filter updates with active filter indicators

### 📊 **Data Visualization**
- Interactive charts using Recharts
- Geographic mapping with Leaflet
- Priority-based color coding
- Responsive design for all screen sizes

### 💾 **Data Export**
- Export filtered data to CSV format
- Includes all relevant company and contact information
- Ready for import into CRM systems

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Maps**: Leaflet
- **Data Processing**: PapaParse, XLSX
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales-intelligence-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
sales-intelligence-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── DataUpload.tsx     # File upload component
│   ├── DashboardStats.tsx # Statistics display
│   ├── DataTable.tsx      # Data table with sorting
│   ├── FilterPanel.tsx    # Filtering interface
│   ├── CompanyMap.tsx     # Geographic visualization
│   └── Charts.tsx         # Chart components
├── types/                 # TypeScript type definitions
│   └── index.ts
├── utils/                 # Utility functions
│   └── dataProcessing.ts  # Data processing logic
├── sample-data/           # Sample data files
│   ├── companies.csv
│   └── people.csv
└── package.json
```

## 📊 Data Format Requirements

### Companies Dataset
**Required Fields:**
- `name` - Company name

**Optional Fields:**
- `website` - Company website URL
- `industry` - Industry classification
- `employee_count` - Number of employees
- `city`, `state`, `country` - Location information
- `phone` - Contact phone number
- `description` - Company description
- `linkedin_url` - LinkedIn company page
- `revenue` - Annual revenue
- `founded` - Year founded

### People Dataset
**Required Fields:**
- `full_name` (or `first_name` + `last_name`) - Contact's full name
- `title` - Job title
- `company` - Company name (must match companies dataset)

**Optional Fields:**
- `email` - Contact email address
- `phone` - Contact phone number
- `linkedin_url` - LinkedIn profile URL
- `department` - Department/team
- `seniority` - Seniority level (C-Suite, VP, Director, Manager, Senior, Mid-Level, Junior)
- `location` - Contact location
- `decision_maker` - Boolean indicating if contact is a decision maker
- `contact_score` - Numeric score for contact quality

## 🎯 Sales Intelligence Features

### **Priority Scoring System**
- **High Priority**: Sales fit score ≥ 70 + 2+ decision makers
- **Medium Priority**: Sales fit score ≥ 50 + 1+ decision maker
- **Low Priority**: All other companies

### **Sales Fit Score Calculation**
The algorithm considers:
- **Company Size** (30 points): Medium-sized companies (50-500 employees) get highest scores
- **Contact Quality** (15 points per decision maker): C-suite and VP contacts
- **Information Completeness** (20 points): Percentage of contacts with email addresses
- **Industry Alignment** (15 points): Tech companies get bonus points
- **Geographic Location** (10 points): US companies preferred

### **Contact Prioritization**
- Decision makers are automatically identified
- Contact scores help prioritize outreach efforts
- Seniority levels are clearly displayed
- Direct contact information (email, phone, LinkedIn) is readily available

## 🚀 Usage Guide

### **1. Upload Your Data**
- Drag and drop or browse for your CSV/Excel files
- Upload both companies and people datasets
- The app will automatically process and merge the data

### **2. Explore the Dashboard**
- **Overview**: Get a quick snapshot of your data
- **Companies**: View detailed company and contact information
- **Geographic View**: See where your target companies are located
- **Analytics**: Deep dive into data patterns and trends

### **3. Filter and Search**
- Use the sidebar filters to narrow down your target companies
- Search for specific companies or contacts
- Filter by priority, industry, size, or location

### **4. Export Actionable Data**
- Click "Export Data" to download filtered results
- Use the exported CSV in your CRM or sales tools
- Share insights with your sales team

## 🎨 Customization

### **Styling**
The app uses Tailwind CSS for styling. You can customize:
- Color scheme in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `app/globals.css`

### **Data Processing**
Modify the scoring algorithm in `utils/dataProcessing.ts`:
- Adjust weights for different factors
- Add new scoring criteria
- Customize priority thresholds

### **Charts and Visualizations**
Add new charts in `components/Charts.tsx`:
- Use Recharts for additional visualizations
- Customize chart colors and styling
- Add new data aggregations

## 🔧 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### **Other Platforms**
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## 📈 Performance Optimization

- **Lazy Loading**: Components load only when needed
- **Memoization**: Expensive calculations are cached
- **Virtual Scrolling**: Large datasets are handled efficiently
- **Image Optimization**: Next.js built-in image optimization

## 🔒 Security Considerations

- All data processing happens client-side
- No data is sent to external servers
- File uploads are processed locally
- Export functionality uses browser APIs only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common issues

## 🎯 Roadmap

- [ ] CRM integration (Salesforce, HubSpot)
- [ ] Email campaign integration
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] API for external data sources
- [ ] Mobile app version
- [ ] Advanced geocoding for better map accuracy
- [ ] Real-time data updates
- [ ] Custom dashboard widgets
- [ ] Advanced export formats (PDF, Excel)

---

**Built with ❤️ for PIT Solutions Sales Team**
