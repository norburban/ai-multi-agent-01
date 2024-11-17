import { useEffect, useRef } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { useAuthStore } from '../stores/authStore'
import { MessageSquare, Send, LogOut } from 'lucide-react'
import CopyButton from './CopyButton'
import MessageContent from './MessageContent'
import ConversationSidebar from './ConversationSidebar'
import { cn } from '../lib/utils'

export default function ChatInterface({ input, setInput, onSubmit, isProcessing }) {
  const messages = useAgentStore(state => state.messages)
  const conversations = useAgentStore(state => state.conversations || [])
  const currentConversationId = useAgentStore(state => state.currentConversationId)
  const signOut = useAuthStore(state => state.signOut)
  const agents = useAgentStore(state => state.agents)
  const selectedAgent = useAgentStore(state => state.selectedAgent)
  const setSelectedAgent = useAgentStore(state => state.setSelectedAgent)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const currentConversation = conversations.find(c => c.id === currentConversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Focus input field when component mounts and when conversation changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentConversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <ConversationSidebar />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {currentConversation?.title || 'New Chat'}
          </h2>
          <button
            onClick={signOut}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Sign out"
          >
            <LogOut size={20} />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-4 rounded-lg p-4',
                    message.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'
                  )}
                >
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        U
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                        A
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <MessageContent content={message.content} />
                    {message.role !== 'user' && (
                      <div className="flex justify-end">
                        <CopyButton text={message.content} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No messages yet. Start a conversation!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input form */}
        <div className="border-t border-gray-200">
          <form onSubmit={onSubmit} className="p-4">
            <div className="max-w-3xl mx-auto flex gap-4">
              <select
                value={selectedAgent?.name || ''}
                onChange={(e) => {
                  const agent = agents.find(a => a.name === e.target.value)
                  setSelectedAgent(agent)
                }}
                className="w-40 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
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
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
