import { useEffect } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { ChevronDown } from 'lucide-react'
import CopyButton from './CopyButton'
import MessageContent from './MessageContent'

function ChatInterface({ input, setInput, onSubmit }) {
  const conversation = useAgentStore(state => state.conversation)
  const isProcessing = useAgentStore(state => state.isProcessing)
  const agents = useAgentStore(state => state.agents)
  const selectedAgent = useAgentStore(state => state.selectedAgent)
  const setSelectedAgent = useAgentStore(state => state.setSelectedAgent)
  const initializeAgents = useAgentStore(state => state.initializeAgents)

  useEffect(() => {
    if (agents.length === 0) {
      initializeAgents()
    }
  }, [agents.length, initializeAgents])

  return (
    <div className="chat-interface">
      <div className="messages-container">
        <div className="messages-column">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'agent-message'}`}
            >
              {message.agent && (
                <div className="message-header">
                  <span className="agent-name">{message.agent}</span>
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  <CopyButton text={message.content || ''} />
                </div>
              )}
              <MessageContent content={message.content || ''} />
            </div>
          ))}
          {isProcessing && (
            <div className="processing-indicator">
              <div className="typing-dots"></div>
            </div>
          )}
        </div>
      </div>
      <form className="input-form" onSubmit={onSubmit}>
        <div className="agent-select-wrapper">
          <select
            className="agent-select"
            value={selectedAgent?.name || ''}
            onChange={(e) => {
              const agent = agents.find(a => a.name === e.target.value)
              setSelectedAgent(agent)
            }}
          >
            {agents.map(agent => (
              <option key={agent.name} value={agent.name}>
                {agent.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="select-icon" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isProcessing}
        />
        <button type="submit" disabled={isProcessing || !selectedAgent}>
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatInterface
