import { useEffect, useRef } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { Send } from 'lucide-react'
import CopyButton from './CopyButton'
import MessageContent from './MessageContent'
import ConversationSidebar from './ConversationSidebar'
import { cn } from '../lib/utils'

function ChatInterface({ input, setInput, onSubmit }) {
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (agents.length === 0) {
      initializeAgents()
    }
  }, [agents.length, initializeAgents])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isProcessing])

  useEffect(() => {
    // Focus input field when conversation changes
    inputRef.current?.focus()
  }, [currentConversationId])

  useEffect(() => {
    // Focus input field after assistant response is complete
    if (!isProcessing) {
      inputRef.current?.focus()
    }
  }, [isProcessing])

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <ConversationSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {currentConversation?.title || 'New Chat'}
          </h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col max-w-[70%] space-y-2",
                message.role === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2",
                  message.role === 'user'
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <MessageContent content={message.content || ''} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 text-xs text-gray-500",
                  message.role === 'user' ? "justify-end" : ""
                )}
              >
                {message.agent && <span>{message.agent}</span>}
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                <CopyButton text={message.content || ''} />
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <form onSubmit={onSubmit} className="flex items-center gap-4">
            <select
              className="w-40 flex-shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="flex-1 min-w-0 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isProcessing || !selectedAgent}
              className={cn(
                "flex items-center justify-center rounded-lg px-4 py-2 text-white transition-colors",
                isProcessing || !selectedAgent
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
