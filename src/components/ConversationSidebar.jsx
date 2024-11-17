import { useAgentStore } from '../stores/agentStore'
import { Plus, MessageSquare, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import { useState } from 'react'

function ConversationSidebar() {
  const [deleteError, setDeleteError] = useState(null)
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

  const handleDelete = async (e, conversationId) => {
    e.stopPropagation()
    setDeleteError(null)
    
    const { error } = await deleteConversation(conversationId)
    if (error) {
      setDeleteError(error)
      setTimeout(() => setDeleteError(null), 5000) // Clear error after 5 seconds
    }
  }

  return (
    <div className="conversation-sidebar">
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

      <div className="conversations-list">
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
    </div>
  )
}

export default ConversationSidebar
