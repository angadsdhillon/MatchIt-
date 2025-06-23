# Deployment Guide - Sales Intelligence Dashboard

## 🚀 Quick Start

The application is now ready to run! The development server should be running at `http://localhost:3000`.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

## 🔧 Local Development

1. **Install dependencies** (already done)
   ```bash
   npm install
   ```

2. **Start development server** (already running)
   ```bash
   npm run dev
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📊 Testing with Sample Data

The application includes sample data files in the `sample-data/` directory:

- `companies.csv` - Sample company data
- `people.csv` - Sample people/contact data

To test the application:

1. Go to the upload section
2. Upload `sample-data/companies.csv` as the Companies Dataset
3. Upload `sample-data/people.csv` as the People Dataset
4. Explore the dashboard with the merged data

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Deploy automatically

### Option 2: Netlify

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or connect your GitHub repository

### Option 3: Self-Hosted

1. **Build for production**
   ```bash
   npm run build
   npm start
   ```

2. **Use a process manager like PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "sales-dashboard" -- start
   ```

## 🔒 Environment Variables

For production deployment, you may want to set these environment variables:

```env
NEXT_PUBLIC_APP_NAME="PIT Solutions Sales Intelligence"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## 📈 Performance Optimization

The application is optimized for:
- **Fast loading**: Lazy loading of components
- **Efficient data processing**: Client-side processing
- **Responsive design**: Works on all devices
- **Modern browser features**: Uses latest web standards

## 🛠️ Customization

### Branding
Update the following files to customize branding:
- `app/layout.tsx` - Page title and metadata
- `app/globals.css` - Color scheme
- `tailwind.config.js` - Theme customization

### Data Processing
Modify `utils/dataProcessing.ts` to:
- Adjust scoring algorithms
- Add new data fields
- Customize matching logic

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or use a different port
   npm run dev -- -p 3001
   ```

2. **Build errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run build
   ```

3. **Map not loading**
   - Check internet connection (Leaflet requires external tiles)
   - Verify browser supports modern JavaScript

### Performance Issues

1. **Large datasets**
   - The app handles up to 10,000+ records efficiently
   - For larger datasets, consider pagination or virtualization

2. **Slow filtering**
   - Filters are applied in real-time
   - Consider debouncing for very large datasets

## 📞 Support

For deployment issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure Node.js version is 18+
4. Check network connectivity for map tiles

## 🎯 Next Steps

After deployment:
1. Upload your actual Success AI data
2. Customize the scoring algorithm for your needs
3. Train your sales team on the dashboard features
4. Set up regular data updates
5. Integrate with your CRM system

---

**Ready to transform your sales intelligence! 🚀** 