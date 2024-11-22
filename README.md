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
│   ├── utils/          # Helper utilities
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── messages/           # Message templates and test data
├── public/            # Static assets
└── dist/             # Production build output
```

## Development

To start the development server:

```bash
npm run dev
```

The development server will start at [http://localhost:5173](http://localhost:5173).

### Environment Setup

1. Copy `.env.development` to create a new `.env` file:
```bash
cp .env.development .env
```

2. Update the environment variables in `.env`:
```env
VITE_OPENAI_API_KEY=your_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

## Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
- A [Vercel](https://vercel.com) account
- Project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Vercel CLI (optional): `npm i -g vercel`

#### Method 1: Deploy via Vercel Dashboard

1. Import Project:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository

2. Configure Project:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. Environment Variables:
   - Add the following environment variables:
     ```
     VITE_OPENAI_API_KEY=your_api_key_here
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Deploy:
   - Click "Deploy"
   - Wait for the build and deployment to complete

#### Method 2: Deploy via Vercel CLI

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Deploy:
   ```bash
   # First-time deployment
   vercel

   # Production deployment
   vercel --prod
   ```

3. Configure Environment Variables:
   ```bash
   # Add environment variables
   vercel env add VITE_OPENAI_API_KEY
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

### Post-Deployment Tasks

1. Domain Setup (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS settings as instructed

2. Verify Deployment:
   - Check deployment URL
   - Test all main functionalities
   - Verify environment variables
   - Monitor build logs

3. Setup Continuous Deployment:
   - Enable auto-deployment for your main branch
   - Configure preview deployments for other branches
   - Set up deployment notifications (optional)

### Troubleshooting

#### Common Issues

1. Build Failures:
   - Verify all dependencies are in `package.json`
   - Check environment variables are set correctly
   - Review build logs in Vercel Dashboard
   - Try local build: `npm run build`

2. Runtime Errors:
   - Check browser console for errors
   - Verify API endpoints and environment variables
   - Test locally with `vercel dev`
   - Check Vercel deployment logs

3. Environment Variables:
   - Ensure all variables start with `VITE_`
   - Variables are case-sensitive
   - Redeploy after updating variables
   - Use `vercel env ls` to verify

4. Performance Issues:
   - Enable Vercel Analytics
   - Check bundle size
   - Verify API response times
   - Monitor Vercel metrics

## Interface Components

The chat interface is composed of several key components:

### Main Layout
- **Main Container**: The root container that holds all chat interface elements
- **Sidebar**: Left sidebar containing chat history and conversation management
- **Main Chat Area**: Primary content area containing all chat-related components

### Chat Components
1. **Chat Header**
   - Displays the current conversation title
   - Located at the top of the main chat area

2. **Messages Area**
   - Scrollable container for message history
   - **Message Container**: Wrapper for each message
   - **Message Bubble**: Individual message display with rounded corners
     - User messages: Brown background with white text
     - Agent responses: White background with dark brown text
   - **Message Footer**: Shows timestamp and agent information

3. **Agent Selection Bar**
   - Horizontal bar with agent selection buttons
   - Quick access to different agents:
     - Comms: Communications specialist
     - SAN: Situation Action Needs specialist
     - AIR: After Incident Review specialist
     - Researcher: Research agent
     - Writer: Content writing specialist
     - Critic: Content review specialist

4. **Input Area**
   - Message input field
   - Send button
   - Located at the bottom of the main chat area

Each component is styled using Tailwind CSS and follows the Nestlé brand color scheme for a consistent and professional appearance.

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
