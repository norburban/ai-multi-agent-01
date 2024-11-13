import { useEffect } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { ChevronDown } from 'lucide-react'
import CopyButton from './CopyButton'
import MessageContent from './MessageContent'
import ConversationSidebar from './ConversationSidebar'

function ChatInterface({ input, setInput, onSubmit }) {
  const {
    conversations,
    currentConversationId,
    isProcessing,
    agents,
    selectedAgent,
    setSelectedAgent,
    initializeAgents
  } = useAgentStore(state => ({
    conversations: state.conversations,
    currentConversationId: state.currentConversationId,
    isProcessing: state.isProcessing,
    agents: state.agents,
    selectedAgent: state.selectedAgent,
    setSelectedAgent: state.setSelectedAgent,
    initializeAgents: state.initializeAgents
  }))

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = currentConversation?.messages || []

  useEffect(() => {
    if (agents.length === 0) {
      initializeAgents()
    }
  }, [agents.length, initializeAgents])

  return (
    <div className="chat-container">
      <ConversationSidebar />
      <div className="chat-interface">
        <div className="messages-container">
          <div className="messages-column">
            {messages.map((message, index) => (
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
    </div>
  )
}

export default ChatInterface
