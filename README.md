# AI Multi-Agent System

A React-based application that implements a multi-agent system where different AI agents can interact and collaborate. Built with React 18, Vite, and OpenAI integration.

## Features

- Multiple specialized AI agents with agent-to-agent communication
- Interactive chat interface with Markdown and LaTeX support
- Syntax highlighting for code blocks
- Authentication system with Supabase
- State management with Zustand
- Modern UI with Tailwind CSS and Lucide React icons
- Real-time conversation view with auto-scroll
- Markdown rendering with support for:
  - Code syntax highlighting
  - Math equations (KaTeX)
  - GitHub Flavored Markdown
  - Tables and diagrams

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **UI Components**: 
  - Radix UI primitives
  - Lucide React icons
  - React Markdown
  - React Syntax Highlighter
- **Development Tools**:
  - PostCSS
  - Autoprefixer
  - TypeScript definitions

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager
- OpenAI API key
- Supabase project with authentication enabled

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd ai-multi-agent-01
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_OPENAI_API_KEY=your_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
ai-multi-agent-01/
├── src/
│   ├── agents/          # AI agent implementations
│   ├── components/      # React components
│   ├── lib/            # Utility functions and configurations
│   ├── stores/         # Zustand state management
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── public/             # Static assets
└── dist/              # Production build output
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate optimized production files in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment on Vercel

### Prerequisites for Vercel Deployment

1. A [Vercel](https://vercel.com) account
2. The [Vercel CLI](https://vercel.com/cli) (optional for command line deployment)
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Method 1: Deploy with Vercel Dashboard

#### For New Projects

1. Log in to your Vercel account and click "New Project"

2. Import your repository from Git

3. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Add Environment Variables:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Click "Deploy"

#### For Existing Projects

1. Log in to your Vercel account and select your existing project

2. Update project settings if needed:
   - Go to "Settings" → "Build & Development Settings"
   - Verify/Update Framework Preset: Vite
   - Verify/Update Build Command: `npm run build`
   - Verify/Update Output Directory: `dist`
   - Verify/Update Install Command: `npm install`

3. Update Environment Variables:
   - Go to "Settings" → "Environment Variables"
   - Add or update required variables:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Trigger a new deployment:
   - Go to "Deployments"
   - Click "Redeploy" on the latest deployment, or
   - Push a new commit to your repository

### Method 2: Deploy with Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Follow the CLI prompts:
   - Set up and deploy: `Y`
   - Select scope: Your account or team
   - Link to existing project: 
     - `Y` if deploying to existing project
     - `N` if creating new project
   - If existing project: Select from list of projects
   - If new project: 
     - Enter project name: `ai-multi-agent-01`
     - Select framework preset: `vite`

5. Add or update environment variables:
   ```bash
   # For new projects
   vercel env add VITE_OPENAI_API_KEY
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY

   # For existing projects
   vercel env pull   # backup existing env vars
   vercel env rm VITE_OPENAI_API_KEY   # if needed
   vercel env add VITE_OPENAI_API_KEY  # add new value
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Post-Deployment

1. Configure your custom domain (optional):
   - Go to project settings → "Domains"
   - Add or update custom domain

2. Verify automatic deployments:
   - Go to project settings → "Git"
   - Confirm Production Branch is correct
   - Check Preview Branch deployments settings
   - Verify GitHub/GitLab/Bitbucket integration

3. Monitor your deployment:
   - View deployment status in Dashboard
   - Check deployment logs
   - Monitor performance analytics
   - Set up status alerts (optional)

### Troubleshooting Deployment

Common issues and solutions:

1. Build fails:
   - Check if all dependencies are in `package.json`
   - Verify environment variables are set
   - Review build logs in Vercel Dashboard
   - Try a clean install: `rm -rf node_modules && npm install`

2. Runtime errors:
   - Check browser console for errors
   - Verify API endpoints are configured
   - Ensure environment variables are accessible
   - Test locally with `vercel dev`

3. Environment variables not working:
   - Verify `VITE_` prefix is present
   - Check both Development and Production environments
   - Rebuild and redeploy after changes
   - Use `vercel env ls` to list all variables

4. Deployment not updating:
   - Force a clean rebuild: `vercel --force`
   - Clear Vercel cache if needed
   - Check if the correct branch is being deployed

## Authentication

The application uses Supabase Authentication for user management. Features include:
- Email/Password authentication
- Session management
- Protected routes
- Automatic session recovery

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
