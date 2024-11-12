# AI Multi-Agent System

A React-based application that implements a multi-agent system where different AI agents can interact and collaborate. Built with React 18, Vite, and OpenAI integration.

## Features

- Multiple specialized AI agents
- Agent-to-agent communication
- Interactive chat interface with Markdown support
- Syntax highlighting for code blocks
- State management with Zustand
- Modern UI with Lucide React icons
- Real-time conversation view

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager
- OpenAI API key

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

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your_api_key_here
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

## Project Structure

```
src/
  ├── agents/         # Agent-related logic and implementations
  ├── components/     # React components
  ├── stores/         # Zustand state management
  └── main.jsx        # Application entry point
```

## Dependencies

### Main Dependencies
- React 18.2.0
- React DOM 18.2.0
- OpenAI 4.0.0
- Zustand 4.4.1 (State Management)
- React Markdown 8.0.7
- React Syntax Highlighter 15.5.0
- React Tooltip 5.21.1
- Lucide React 0.268.0

### Development Dependencies
- Vite 4.4.5
- @vitejs/plugin-react 4.0.3
- TypeScript types for React

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
