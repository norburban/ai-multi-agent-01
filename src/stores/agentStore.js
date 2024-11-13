import { create } from 'zustand'
import { ResearchAgent, WriterAgent, CriticAgent } from '../agents/SpecializedAgents'

const useAgentStore = create((set, get) => ({
  agents: [],
  conversations: [],
  currentConversationId: null,
  selectedAgent: null,
  isProcessing: false,
  error: null,

  initializeAgents: () => {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured')
      }
      const agents = [
        new ResearchAgent(),
        new WriterAgent(),
        new CriticAgent()
      ]
      set({ agents, selectedAgent: agents[0], error: null })
      
      // Load saved conversations
      const savedConversations = localStorage.getItem('conversations')
      if (savedConversations) {
        const conversations = JSON.parse(savedConversations)
        set({ 
          conversations,
          currentConversationId: conversations[0]?.id || null
        })
      } else {
        // Create initial conversation
        get().createNewConversation()
      }
    } catch (error) {
      set({ error: error.message })
    }
  },

  createNewConversation: () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    }
    
    set(state => ({
      conversations: [newConversation, ...state.conversations],
      currentConversationId: newConversation.id
    }))
    
    get().saveConversations()
  },

  selectConversation: (conversationId) => {
    set({ currentConversationId: conversationId })
  },

  deleteConversation: (conversationId) => {
    set(state => {
      const newConversations = state.conversations.filter(c => c.id !== conversationId)
      const newCurrentId = state.currentConversationId === conversationId
        ? newConversations[0]?.id || null
        : state.currentConversationId
        
      return {
        conversations: newConversations,
        currentConversationId: newCurrentId
      }
    })
    
    get().saveConversations()
  },

  updateConversationTitle: (conversationId, title) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, title }
          : conv
      )
    }))
    
    get().saveConversations()
  },

  setSelectedAgent: (agent) => {
    set({ selectedAgent: agent })
  },

  sendMessage: async (message) => {
    const { selectedAgent, conversations, currentConversationId } = get()
    
    if (!selectedAgent || !currentConversationId) return

    set({ isProcessing: true, error: null })
    
    try {
      const currentConversation = conversations.find(c => c.id === currentConversationId)
      const updatedMessages = [...currentConversation.messages, { 
        role: 'user', 
        content: message,
        timestamp: new Date().toISOString()
      }]

      // Update conversation messages
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === currentConversationId
            ? { 
                ...conv, 
                messages: updatedMessages,
                title: conv.title === 'New Chat' ? message.slice(0, 30) + '...' : conv.title
              }
            : conv
        )
      }))

      // Process message with selected agent
      const response = await selectedAgent.process(message, updatedMessages)
      
      // Add agent response
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, {
                  role: 'assistant',
                  agent: selectedAgent.name,
                  content: response,
                  timestamp: new Date().toISOString()
                }]
              }
            : conv
        )
      }))
      
      get().saveConversations()
    } catch (error) {
      console.error('Error in agent processing:', error)
      set(state => ({
        error: error.message,
        conversations: state.conversations.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, {
                  role: 'system',
                  content: `Error: ${error.message}`,
                  timestamp: new Date().toISOString()
                }]
              }
            : conv
        )
      }))
    } finally {
      set({ isProcessing: false })
    }
  },

  saveConversations: () => {
    const { conversations } = get()
    localStorage.setItem('conversations', JSON.stringify(conversations))
  },

  clearCurrentConversation: () => {
    const { currentConversationId, agents } = get()
    if (!currentConversationId) return
    
    agents.forEach(agent => agent.clearMemory())
    
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: [] }
          : conv
      )
    }))
    
    get().saveConversations()
  }
}))

export { useAgentStore }
