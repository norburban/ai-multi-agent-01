import { useAgentStore } from '../stores/agentStore'
import * as LucideIcons from 'lucide-react'

function ConversationSidebar() {
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    selectConversation,
    deleteConversation,
    error
  } = useAgentStore(state => ({
    conversations: state.conversations,
    currentConversationId: state.currentConversationId,
    createNewConversation: state.createNewConversation,
    selectConversation: state.selectConversation,
    deleteConversation: state.deleteConversation,
    error: state.error
  }))

  const handleDelete = async (e, conversationId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(conversationId)
    }
  }

  return (
    <aside className="w-64 border-r border-gray-300 bg-white flex flex-col h-full">
      <button 
        className="mx-4 mt-4 p-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700"
        onClick={createNewConversation}
      >
        <LucideIcons.Plus className="w-4 h-4" />
        New Chat
      </button>
      
      {error && (
        <div className="mx-4 mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-1 p-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                conv.id === currentConversationId ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => selectConversation(conv.id)}
            >
              <LucideIcons.MessageSquare width="18" height="18" className="text-gray-500" />
              <span className="truncate text-gray-700 flex-1">
                {conv.title || 'New Chat'}
              </span>
              <LucideIcons.Trash2 
                width="18" 
                height="18" 
                className="text-gray-400 hover:text-red-500 cursor-pointer ml-2"
                onClick={(e) => handleDelete(e, conv.id)}
                aria-label="Delete conversation"
              />
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default ConversationSidebar
