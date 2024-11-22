import { useAgentStore } from '../stores/agentStore'
import { useAuthStore } from '../stores/authStore'
import { Plus, MessageSquare, Trash2, AlertCircle, User, Clock } from 'lucide-react'
import { cn } from '../lib/utils'
import { useState, useEffect } from 'react'

function ConversationSidebar() {
  const [deleteError, setDeleteError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    selectConversation,
    deleteConversation
  } = useAgentStore(state => ({
    conversations: state.conversations,
    currentConversationId: state.currentConversationId,
    createNewConversation: state.createNewConversation,
    selectConversation: state.selectConversation,
    deleteConversation: state.deleteConversation
  }))

  const user = useAuthStore(state => state.user)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleDelete = async (e, conversationId) => {
    e.stopPropagation()
    setDeleteError(null)
    
    const { error } = await deleteConversation(conversationId)
    if (error) {
      setDeleteError(error)
      setTimeout(() => setDeleteError(null), 5000) // Clear error after 5 seconds
    }
  }

  const formatTime = (date, options) => {
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      ...options
    }).replace(',', '').replace(/\s(?=[0-9])/, ' ')
  }

  return (
    <div className="conversation-sidebar flex flex-col h-full">
      <button 
        className="new-chat-button"
        onClick={createNewConversation}
      >
        <Plus size={16} />
        New Chat
      </button>
      
      {deleteError && (
        <div className="mx-4 my-2 p-2 text-sm bg-red-100 text-red-600 rounded-md flex items-center gap-2">
          <AlertCircle size={14} />
          {deleteError}
        </div>
      )}

      <div className="conversations-list flex-1">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            className={cn(
              "conversation-item",
              conv.id === currentConversationId ? "active" : ""
            )}
            onClick={(e) => {
              e.preventDefault()
              selectConversation(conv.id)
            }}
            role="button"
            tabIndex={0}
          >
            <MessageSquare size={16} />
            <span className="conversation-title">
              {conv.title || 'New Chat'}
            </span>
            <button 
              className="delete-button"
              onClick={(e) => handleDelete(e, conv.id)}
              aria-label="Delete conversation"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* User Info and Time Section */}
      <div className="h-32 flex-shrink-0 border-t border-[var(--nestle-light-brown)] px-6 py-4 bg-[var(--nestle-offwhite)] flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[var(--nestle-dark-brown)] mb-3">
          <User size={16} />
          <span className="text-sm font-medium truncate">
            {user?.email || 'Guest User'}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[var(--nestle-medium-brown)]">
            <Clock size={14} />
            <span className="text-xs">
              Local: {formatTime(currentTime, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[var(--nestle-medium-brown)]">
            <Clock size={14} />
            <span className="text-xs">
              UTC: {formatTime(currentTime, { timeZone: 'UTC' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationSidebar
