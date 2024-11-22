# AI Multi-Agent System

A modern web application featuring multiple AI agents working together to provide intelligent responses and solutions. Built with React, Tailwind CSS, and OpenAI's GPT API.

## Features

- Multiple specialized AI agents with agent-to-agent communication
- Interactive chat interface with Markdown and LaTeX support
- Syntax highlighting for code blocks
- Authentication system with Supabase
- State management with Zustand
- Real-time database sync with Supabase
- Error boundary implementation
- Efficient message context handling
- Rate limiting and retry logic
- Responsive design with Tailwind CSS
- Modern React patterns and hooks

## Technology Stack

- Frontend: React, Tailwind CSS
- State Management: Zustand
- Authentication: Supabase Auth
- Database: Supabase
- AI: OpenAI GPT API
- UI Components: Lucide React Icons
- Markdown: React Markdown
- Syntax Highlighting: React Syntax Highlighter

## Environment Setup

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_API_TYPE=openai
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Development

The project follows a modular architecture:

- `/src/components`: React components
- `/src/stores`: Zustand state management
- `/src/agents`: AI agent implementations
- `/src/lib`: Utility functions and API clients
- `/src/utils`: Helper functions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
