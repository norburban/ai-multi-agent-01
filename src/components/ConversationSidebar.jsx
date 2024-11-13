import { useAgentStore } from '../stores/agentStore'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'

function ConversationSidebar() {
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

  return (
    <div className="conversation-sidebar">
      <button 
        className="new-chat-button"
        onClick={createNewConversation}
      >
        <Plus size={16} />
        New Chat
      </button>
      
      <div className="conversations-list">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
            onClick={() => selectConversation(conv.id)}
          >
            <MessageSquare size={16} />
            <span className="conversation-title">
              {conv.title || 'New Chat'}
            </span>
            <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation()
                deleteConversation(conv.id)
              }}
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
