# AI Multi-Agent System

A React-based application that implements a multi-agent system where different AI agents can interact and collaborate. Built with React 18, Vite, and OpenAI integration.

## Features

- Multiple specialized AI agents (Research, Writer, and Critic)
- Persistent conversations with Supabase backend
- Interactive chat interface with Markdown support
- Syntax highlighting for code blocks
- State management with Zustand
- Modern UI with Lucide React icons
- Real-time conversation management:
  - Create new conversations
  - Delete conversations with confirmation
  - Switch between conversations
  - Auto-focus on input field
- User authentication and data persistence
- Responsive design with Tailwind CSS
- Copy functionality for AI responses

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager
- OpenAI API key
- Supabase account and project

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

3. Create a `.env` file in the root directory and add your API keys:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
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

To preview the production build:

```bash
npm run preview
```

## Deployment to Vercel

### Prerequisites for Deployment
- A [Vercel](https://vercel.com) account
- The [Vercel CLI](https://vercel.com/cli) (optional for local testing)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Prepare Your Project**
   - Ensure your project is pushed to a Git repository
   - Make sure all environment variables are properly set in your `.env` file
   - Verify the build runs successfully locally with `npm run build`

2. **Deploy to Vercel**

   Option 1: Deploy via Vercel Dashboard (Recommended for first deployment)
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables:
     ```
     VITE_OPENAI_API_KEY
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     ```
   - Click "Deploy"

   Option 2: Deploy via Vercel CLI
   ```bash
   # Install Vercel CLI globally
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy to Vercel
   vercel

   # Deploy to production
   vercel --prod
   ```

3. **Configure Environment Variables on Vercel**
   - Go to your project settings in Vercel Dashboard
   - Navigate to "Environment Variables"
   - Add the following variables:
     ```
     VITE_OPENAI_API_KEY=your_openai_api_key
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up Automatic Deployments**
   - By default, Vercel will deploy automatically when you push to your main branch
   - You can configure branch deployments in the project settings
   - Preview deployments are automatically created for pull requests

### Post-Deployment

1. **Verify Your Deployment**
   - Check the deployment logs for any errors
   - Test all features in the production environment
   - Verify environment variables are working correctly

2. **Monitor Your Application**
   - Use Vercel Analytics (if enabled)
   - Check the deployment status in Vercel Dashboard
   - Monitor API usage and performance

3. **Custom Domain (Optional)**
   - Go to project settings in Vercel Dashboard
   - Navigate to "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

### Troubleshooting Deployment

Common issues and solutions:

1. **Build Failures**
   - Check build logs in Vercel Dashboard
   - Verify all dependencies are properly listed in `package.json`
   - Ensure environment variables are correctly set

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API keys and environment variables
   - Test API endpoints and connections

3. **Performance Issues**
   - Enable Vercel Analytics for monitoring
   - Check bundle size and consider optimizations
   - Review API response times and caching strategies

For more detailed information, visit the [Vercel Documentation](https://vercel.com/docs).

## Project Structure

```
src/
  ├── agents/         # Agent-related logic and implementations
  ├── components/     # React components
  ├── stores/         # Zustand state management
  ├── lib/           # Utility functions and configurations
  └── main.jsx       # Application entry point
```

## Key Components

- `ConversationSidebar`: Manages conversation list and actions
- `ChatInterface`: Main chat interface with message display and input
- `MessageContent`: Renders messages with Markdown support
- `CopyButton`: Enables copying AI responses

## State Management

The application uses Zustand for state management with two main stores:
- `agentStore`: Manages conversations, messages, and agent selection
- `authStore`: Handles user authentication state

## Dependencies

### Main Dependencies
- React 18.2.0
- React DOM 18.2.0
- OpenAI 4.0.0
- Zustand 4.4.1 (State Management)
- Supabase (Backend and Authentication)
- React Markdown 8.0.7
- React Syntax Highlighter 15.5.0
- React Tooltip 5.21.1
- Lucide React 0.268.0
- Tailwind CSS 3.x

### Development Dependencies
- Vite 4.4.5
- @vitejs/plugin-react 4.0.3
- TypeScript types for React
- PostCSS and Autoprefixer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
