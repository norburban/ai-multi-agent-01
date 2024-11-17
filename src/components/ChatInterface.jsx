import { useEffect, useRef } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { MessageSquare, Send, Plus } from 'lucide-react'
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
    initializeAgents,
    createNewConversation,
    selectConversation
  } = useAgentStore(state => ({
    conversations: state.conversations,
    currentConversationId: state.currentConversationId,
    isProcessing: state.isProcessing,
    agents: state.agents,
    selectedAgent: state.selectedAgent,
    setSelectedAgent: state.setSelectedAgent,
    initializeAgents: state.initializeAgents,
    createNewConversation: state.createNewConversation,
    selectConversation: state.selectConversation
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
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white">
        {/* New Chat Button */}
        <div className="p-4 flex-shrink-0">
          <button
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={createNewConversation}
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  "hover:bg-gray-100",
                  currentConversationId === conv.id ? "bg-gray-100" : ""
                )}
              >
                <MessageSquare size={18} className="text-gray-500" />
                <span className="truncate text-gray-700">{conv.title || 'New Chat'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
                message.role === 'user' ? "" : ""
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
                  message.role === 'user' ? "" : ""
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
              className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
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
