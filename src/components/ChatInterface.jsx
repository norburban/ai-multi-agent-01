import { useEffect, useRef, useState } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { useAuthStore } from '../stores/authStore'
import { Send, Clipboard } from 'lucide-react'
import CopyButton from './CopyButton'
import MessageContent from './MessageContent'
import ConversationSidebar from './ConversationSidebar'
import { cn } from '../lib/utils'

function ChatInterface({ input, setInput, onSubmit }) {
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const titleInputRef = useRef(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  
  const {
    conversations,
    currentConversationId,
    isProcessing,
    agents,
    selectedAgent,
    setSelectedAgent,
    initializeAgents,
    updateConversationTitle
  } = useAgentStore(state => ({
    conversations: state.conversations,
    currentConversationId: state.currentConversationId,
    isProcessing: state.isProcessing,
    agents: state.agents,
    selectedAgent: state.selectedAgent,
    setSelectedAgent: state.setSelectedAgent,
    initializeAgents: state.initializeAgents,
    updateConversationTitle: state.updateConversationTitle
  }))

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = currentConversation?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleTitleEdit = () => {
    setEditedTitle(currentConversation?.title || '')
    setIsEditingTitle(true)
  }

  const handleTitleSave = async () => {
    if (editedTitle.trim() && currentConversationId) {
      await updateConversationTitle(currentConversationId, editedTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
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

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus()
    }
  }, [isEditingTitle])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      // Only update if we got text content
      if (text) {
        setInput(text)
        inputRef.current?.focus()
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <ConversationSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-[var(--nestle-light-brown)] bg-[var(--nestle-offwhite)]">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              className="title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              maxLength={50}
            />
          ) : (
            <h2 
              className="editable-title"
              onClick={handleTitleEdit}
              title="Click to edit"
            >
              {currentConversation?.title || 'New Chat'}
            </h2>
          )}
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={useAuthStore.getState().signOut}
              className="px-4 py-2 text-sm font-medium text-[var(--nestle-offwhite)] bg-[var(--nestle-brown)] rounded-md hover:bg-[var(--nestle-dark-brown)] active:transform active:scale-95 transition-all duration-150 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 bg-[var(--nestle-offwhite)]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                message.role === 'user' 
                  ? "flex flex-col max-w-[70%] space-y-2"
                  : "flex flex-col max-w-[90%] space-y-2",
                message.role === 'user' ? "mr-auto" : "ml-auto"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2",
                  message.role === 'user'
                    ? "bg-[var(--nestle-brown)] text-[var(--nestle-offwhite)]"
                    : "bg-white text-[var(--nestle-dark-brown)] border border-[var(--nestle-light-brown)]"
                )}
              >
                <MessageContent content={message.content || ''} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 text-xs text-[var(--nestle-medium-brown)]",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.agent && <span>{message.agent}</span>}
                <span>
                  {new Date(message.timestamp).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'UTC'
                  }).replace(',', '').replace(/\s(?=[0-9])/, ' ')} UTC
                </span>
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

        {/* Agent Selection Bar */}
        <div className="border-t border-[var(--nestle-light-brown)] bg-[var(--nestle-offwhite)] px-6 py-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {agents.map((agent) => {
              // Use the simplified name defined in the agent class
              const simplifiedName = agent.simplifiedName || agent.name;
              
              return (
                <button
                  key={agent.name}
                  onClick={() => setSelectedAgent(agent)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedAgent?.name === agent.name
                      ? "bg-[var(--nestle-brown)] text-[var(--nestle-offwhite)]"
                      : "bg-[var(--nestle-tan)] text-[var(--nestle-dark-brown)] hover:bg-[var(--nestle-light-brown)]"
                  )}
                >
                  {simplifiedName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--nestle-light-brown)] bg-white">
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-[var(--nestle-medium-brown)] hover:text-[var(--nestle-brown)] transition-colors duration-200 hover:bg-[var(--nestle-tan)] rounded"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <Clipboard size={18} />
            </button>
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                className="w-full p-2 border border-[var(--nestle-light-brown)] rounded-md focus:outline-none focus:border-[var(--nestle-brown)] resize-none"
                placeholder={selectedAgent ? `Ask ${selectedAgent.name}...` : "Select an agent..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSubmit(e)
                  }
                }}
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="p-2 bg-[var(--nestle-brown)] text-white rounded-md hover:bg-[var(--nestle-dark-brown)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={!input.trim() || isProcessing || !selectedAgent}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
