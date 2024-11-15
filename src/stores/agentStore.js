import { create } from 'zustand'
import { ResearchAgent, WriterAgent, CriticAgent } from '../agents/SpecializedAgents'
import { supabase } from '../lib/supabase'

const useAgentStore = create((set, get) => ({
  agents: [],
  conversations: [],
  currentConversationId: null,
  selectedAgent: null,
  isProcessing: false,
  error: null,
  userId: null,

  initializeAgents: async () => {
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
      
      // Load saved conversations from Supabase
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Parse messages from JSON if needed
      const parsedConversations = conversations?.map(conv => ({
        ...conv,
        messages: Array.isArray(conv.messages) ? conv.messages : []
      })) || []

      if (parsedConversations.length > 0) {
        set({ 
          conversations: parsedConversations,
          currentConversationId: parsedConversations[0]?.id || null
        })
      } else {
        // Create initial conversation
        await get().createNewConversation()
      }
    } catch (error) {
      set({ error: error.message })
    }
  },

  createNewConversation: async () => {
    const newConversation = {
      title: 'New Chat',
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert(newConversation)
        .select()
        .single()

      if (error) throw error
      
      set(state => ({
        conversations: [data, ...state.conversations],
        currentConversationId: data.id
      }))

      return data
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  },

  saveConversations: async () => {
    const { conversations } = get()
    const currentConversation = conversations.find(c => c.id === get().currentConversationId)
    
    if (!currentConversation) return

    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          title: currentConversation.title,
          messages: currentConversation.messages || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConversation.id)

      if (error) throw error
    } catch (error) {
      console.error('Error saving conversation:', error)
      throw error
    }
  },

  sendMessage: async (message) => {
    const { selectedAgent, conversations, currentConversationId } = get()
    
    if (!selectedAgent || !currentConversationId) return

    set({ isProcessing: true, error: null })
    
    try {
      const currentConversation = conversations.find(c => c.id === currentConversationId)
      if (!currentConversation) throw new Error('Conversation not found')

      const updatedMessages = [...(currentConversation.messages || []), { 
        role: 'user', 
        content: message,
        timestamp: new Date().toISOString()
      }]

      const newTitle = currentConversation.title === 'New Chat' 
        ? message.slice(0, 30) + '...' 
        : currentConversation.title

      // Update conversation in state
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        title: newTitle,
        updated_at: new Date().toISOString()
      }

      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === currentConversationId ? updatedConversation : conv
        )
      }))

      // Save to Supabase
      await supabase
        .from('conversations')
        .update({
          messages: updatedMessages,
          title: newTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConversationId)

      // Process message with selected agent
      const response = await selectedAgent.process(message, updatedMessages)
      
      // Add agent response
      const messagesWithResponse = [...updatedMessages, {
        role: 'assistant',
        agent: selectedAgent.name,
        content: response,
        timestamp: new Date().toISOString()
      }]

      // Update state with agent response
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: messagesWithResponse
              }
            : conv
        )
      }))
      
      // Save updated conversation with agent response
      await supabase
        .from('conversations')
        .update({
          messages: messagesWithResponse,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConversationId)

    } catch (error) {
      console.error('Error in agent processing:', error)
      set(state => ({
        error: error.message,
        conversations: state.conversations.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...(conv.messages || []), {
                  role: 'system',
                  content: `Error: ${error.message}`,
                  timestamp: new Date().toISOString()
                }]
              }
            : conv
        )
      }))
      
      // Save error message to Supabase
      try {
        const currentConversation = get().conversations.find(c => c.id === currentConversationId)
        await supabase
          .from('conversations')
          .update({
            messages: currentConversation.messages,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversationId)
      } catch (e) {
        console.error('Error saving error message:', e)
      }
    } finally {
      set({ isProcessing: false })
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (error) throw error

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
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  },

  updateConversationTitle: async (conversationId, title) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          title,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      if (error) throw error

      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, title }
            : conv
        )
      }))
    } catch (error) {
      console.error('Error updating conversation title:', error)
    }
  },

  selectConversation: (conversationId) => {
    set({ currentConversationId: conversationId })
  },

  setSelectedAgent: (agent) => {
    set({ selectedAgent: agent })
  },

  clearCurrentConversation: async () => {
    const { currentConversationId, agents } = get()
    if (!currentConversationId) return
    
    agents.forEach(agent => agent.clearMemory())
    
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          messages: [],
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConversationId)

      if (error) throw error

      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, messages: [] }
            : conv
        )
      }))
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }
}))

export { useAgentStore }
