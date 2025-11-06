# Industrial CRM - Development Workflow

## Live Development Environment

### Quick Start

1. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

2. **Start the dev server with live preview**:
   ```bash
   npm start
   ```

   This starts the development server at **http://localhost:3000** with:
   - Live hot reload (changes update instantly in the browser)
   - Auto-compilation on file save
   - Error overlay in the browser
   - ESLint warnings in the console

3. **Open your browser**:
   Navigate to http://localhost:3000 to see your app running live

### Development Iteration Workflow

#### Making Changes

1. **Edit any file** in the `src/` directory
2. **Save the file** - the app will automatically:
   - Recompile the code
   - Refresh the browser
   - Show any errors or warnings

3. **See changes instantly** in the browser without manual refresh

#### Key Files

- `src/App.jsx` - Main application component
- `src/index.js` - Application entry point
- `src/index.css` - Global styles
- `public/index.html` - HTML template

### Testing Before Production

1. **Check for warnings**:
   - Watch the terminal for ESLint warnings
   - Fix any issues before committing

2. **Test functionality**:
   - Add/edit/delete properties
   - Add/edit/delete brokers
   - Test search functionality
   - Verify calculations (NOI, DSCR, LTV, CoC)
   - Check localStorage persistence (refresh page)

3. **Build for production** (test build):
   ```bash
   npm run build
   ```

   This creates an optimized production build in the `build/` directory:
   - Minified code
   - Optimized assets
   - Ready for deployment

4. **Preview production build** (optional):
   ```bash
   npm install -g serve
   serve -s build -p 5000
   ```
   Opens at http://localhost:5000

## Deployment to Production

### Pre-deployment Checklist

- [ ] All features tested and working
- [ ] No console errors in browser
- [ ] No ESLint warnings in build
- [ ] Production build succeeds (`npm run build`)
- [ ] All changes committed to git
- [ ] Code reviewed

### Git Workflow

1. **Check current status**:
   ```bash
   git status
   ```

2. **Stage your changes**:
   ```bash
   git add .
   ```

3. **Commit with descriptive message**:
   ```bash
   git commit -m "Add/update: [description of changes]"
   ```

4. **Push to branch**:
   ```bash
   git push -u origin claude/vibe-code-live-preview-011CUs18kWyEhV2yQMrqRh2S
   ```

### Decision Framework: When to Push to Prod

Push to production when:

1. **Feature Complete**
   - All acceptance criteria met
   - No known bugs
   - User testing complete (if applicable)

2. **Quality Checks Pass**
   - Build completes without errors
   - No breaking changes
   - Performance is acceptable
   - Mobile responsive (if required)

3. **Documentation Updated**
   - README reflects new features
   - Comments added for complex logic
   - API changes documented (if applicable)

4. **Stakeholder Approval**
   - Product owner reviewed
   - Design approved
   - Business logic validated

### Production Deployment Options

#### Option 1: Static Hosting (Netlify, Vercel, etc.)

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to your hosting service

#### Option 2: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/industrial-crm",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

#### Option 3: Docker Container

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Build and run:
   ```bash
   docker build -t industrial-crm .
   docker run -p 80:80 industrial-crm
   ```

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm test` | Run test suite (if tests exist) |
| `npm run eject` | Eject from Create React App (⚠️ irreversible) |

## Troubleshooting

**Port 3000 already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm start
```

**Build fails:**
- Check for syntax errors in code
- Ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Hot reload not working:**
- Check file watcher limits (Linux): `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`
- Restart the dev server

## Architecture Notes

- **React 18** - Latest React features
- **Create React App** - Zero-config build setup
- **Tailwind CSS** - Utility-first styling (CDN version)
- **localStorage** - Client-side data persistence
- **Lucide React** - Icon library

## Current Features

1. **Property Management**
   - Add/edit/delete industrial properties
   - Track financial metrics (NOI, DSCR, LTV, CoC)
   - Store Crexi listing links
   - Search by address or listing link
   - Deal notes

2. **Broker Management**
   - Add/edit/delete broker contacts
   - Track conversations and notes
   - Email and phone links

3. **Financial Calculations**
   - Automatic NOI calculation
   - DSCR (Debt Service Coverage Ratio)
   - LTV (Loan to Value)
   - CoC (Cash on Cash return)
   - Annual rent projections
