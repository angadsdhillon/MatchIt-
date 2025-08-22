# Developer Setup Checklist - MatchIt App

## Essential Software Requirements

### 1. Node.js and npm
- **Download**: https://nodejs.org/
- **Version**: 18.x or higher (LTS recommended)
- **What it includes**: Node.js runtime and npm package manager
- **Why needed**: Next.js framework and all JavaScript dependencies
- **Installation**: Download installer and run - npm comes bundled with Node.js

### 2. Git
- **Download**: https://git-scm.com/
- **Version**: Latest stable version
- **Why needed**: Version control, cloning repository, pushing changes
- **Installation**: Download installer for Windows/Mac/Linux
- **Post-install**: Configure user name and email:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@company.com"
  ```

### 3. Code Editor
- **Recommended**: Visual Studio Code (https://code.visualstudio.com/)
- **Alternative**: WebStorm, Sublime Text, or any code editor
- **Why needed**: Writing and editing code files
- **VS Code Extensions to install**:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag
  - Bracket Pair Colorizer

### 4. Web Browser
- **Recommended**: Chrome, Firefox, or Edge (latest versions)
- **Why needed**: Testing the application, developer tools for debugging
- **Developer Tools**: Essential for debugging JavaScript, network requests, and console errors

## Optional but Recommended Tools

### 5. Postman or Insomnia
- **Download**: https://www.postman.com/ or https://insomnia.rest/
- **Why needed**: Testing API endpoints, debugging API calls
- **Use case**: Testing the AI endpoints (/api/ask-ai, /api/ask-gemini) before implementing in code

### 6. Database Tools (if adding database later)
- **MongoDB Compass**: If using MongoDB
- **pgAdmin**: If using PostgreSQL
- **MySQL Workbench**: If using MySQL
- **Why needed**: Database management and query testing

### 7. Terminal/Command Line Tools
- **Windows**: Windows Terminal (from Microsoft Store) or Git Bash
- **Mac**: Terminal (built-in) or iTerm2
- **Linux**: Terminal (built-in)
- **Why needed**: Running npm commands, git operations, server management

## Development Environment Setup

### 8. Environment Variables File
- **File**: .env.local (create in project root)
- **Required variables**:
  ```
  GEMINI_API_KEY=your-gemini-api-key
  GROQ_API_KEY=your-groq-api-key
  SERPER_API_KEY=your-serper-api-key
  NEXT_PUBLIC_ADZUNA_APP_ID=your-adzuna-app-id
  NEXT_PUBLIC_ADZUNA_API_KEY=your-adzuna-api-key
  ```

### 9. API Accounts to Create
- **Google AI Studio**: https://makersuite.google.com/app/apikey
- **Groq Console**: https://console.groq.com/
- **Serper.dev**: https://serper.dev/
- **Adzuna**: https://developer.adzuna.com/ (optional)

## System Requirements

### 10. Operating System
- **Windows**: Windows 10/11 (64-bit)
- **Mac**: macOS 10.15 or later
- **Linux**: Ubuntu 18.04+, CentOS 7+, or similar
- **Why needed**: Node.js and development tools compatibility

### 11. Hardware Requirements
- **RAM**: Minimum 8GB, recommended 16GB+
- **Storage**: At least 5GB free space
- **Processor**: Any modern CPU (Intel i5/AMD Ryzen 5 or better)
- **Why needed**: Running development server, handling large datasets, smooth development experience

### 12. Internet Connection
- **Speed**: Stable broadband connection
- **Why needed**: Downloading packages, API calls, version control operations

## Installation Order

1. **Install Node.js** (includes npm)
2. **Install Git**
3. **Install VS Code** (or preferred editor)
4. **Install terminal tools** (if needed)
5. **Clone the repository**
6. **Install project dependencies**: `npm install`
7. **Create .env.local file**
8. **Obtain API keys** and add to .env.local
9. **Start development server**: `npm run dev`

## Verification Steps

After installation, verify everything works:

1. **Node.js**: `node --version` (should show 18.x or higher)
2. **npm**: `npm --version` (should show 8.x or higher)
3. **Git**: `git --version` (should show latest version)
4. **Project**: `npm run dev` (should start server on localhost:3000)
5. **API Keys**: Test AI features in the app

## Troubleshooting Common Issues

### Node.js Issues
- **Permission errors**: Run terminal as administrator (Windows) or use sudo (Mac/Linux)
- **Version conflicts**: Use Node Version Manager (nvm) for multiple Node.js versions

### Git Issues
- **Authentication**: Set up SSH keys or use personal access tokens
- **Large files**: Ensure Git LFS is installed if working with large datasets

### npm Issues
- **Package conflicts**: Delete node_modules and package-lock.json, then run `npm install`
- **Cache issues**: Run `npm cache clean --force`

### API Issues
- **CORS errors**: Check if API keys are correctly set in .env.local
- **Rate limiting**: Monitor API usage and implement caching if needed

## Additional Tools for Advanced Development

### 13. Docker (Optional)
- **Download**: https://www.docker.com/
- **Why needed**: Containerized development, consistent environments
- **Use case**: If you plan to containerize the application

### 14. Database (If adding later)
- **MongoDB**: https://www.mongodb.com/try/download/community
- **PostgreSQL**: https://www.postgresql.org/download/
- **MySQL**: https://dev.mysql.com/downloads/
- **Why needed**: If you plan to add persistent data storage

### 15. Monitoring Tools (Optional)
- **PM2**: `npm install -g pm2` (process manager for production)
- **Why needed**: Managing the application in production environment

## Security Considerations

### 16. Environment Security
- **Never commit .env.local** to version control
- **Use environment variables** in production
- **Rotate API keys** regularly
- **Monitor API usage** to prevent unexpected charges

### 17. Code Security
- **Keep dependencies updated**: `npm audit` and `npm update`
- **Use HTTPS** in production
- **Implement proper authentication** if adding user features

## Performance Optimization Tools

### 18. Development Performance
- **Webpack Bundle Analyzer**: Analyze bundle size
- **Lighthouse**: Performance auditing
- **React Developer Tools**: Browser extension for React debugging

## Summary

**Essential (Must Have)**:
1. Node.js 18+ with npm
2. Git
3. VS Code or code editor
4. Web browser
5. API keys for AI services

**Recommended (Should Have)**:
6. Postman/Insomnia for API testing
7. Good terminal/command line tool
8. 16GB+ RAM for smooth development

**Optional (Nice to Have)**:
9. Docker for containerization
10. Database tools if adding persistence
11. Monitoring tools for production

This setup will ensure the new developer can run, develop, and maintain the MatchIt application without any issues. 