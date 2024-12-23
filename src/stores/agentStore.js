import { create } from 'zustand'
import { ResearchAgent, WriterAgent, CriticAgent, CommsSpecialist, SANReportSpecialist, AIRSpecialist } from '../agents/SpecializedAgents'
import { supabase } from '../lib/supabase'
// Touch to update features

const useAgentStore = create((set, get) => ({
  agents: [],
  conversations: [],
  currentConversationId: null,
  selectedAgent: null,
  isProcessing: false,
  error: null,

  initializeAgents: async () => {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured')
      }
      const agents = [
        new CommsSpecialist(),
        new SANReportSpecialist(),
        new AIRSpecialist(),
        new ResearchAgent(),
        new WriterAgent(),
        new CriticAgent()
        // Add more agents here
      ]
      set({ agents, selectedAgent: agents[0], error: null })
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load saved conversations from Supabase
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const newConversation = {
      title: 'New Chat',
      messages: [],
      user_id: user.id,
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          title: currentConversation.title,
          messages: currentConversation.messages || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConversation.id)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (error) {
      console.error('Error saving conversation:', error)
    }
  },

  sendMessage: async (message) => {
    const { selectedAgent, conversations, currentConversationId } = get()
    
    if (!selectedAgent || !currentConversationId) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    set({ isProcessing: true, error: null })
    
    try {
      const currentConversation = conversations.find(c => c.id === currentConversationId)
      if (!currentConversation) throw new Error('Conversation not found')

      // Add user message at the end of the array (chronological order)
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
        .eq('user_id', user.id)

      // Process message with selected agent
      const response = await selectedAgent.process(message, updatedMessages)
      
      // Add agent response at the end (chronological order)
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
        .eq('user_id', user.id)

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
          .eq('user_id', user.id)
      } catch (e) {
        console.error('Error saving error message:', e)
      }
    } finally {
      set({ isProcessing: false })
    }
  },

  deleteConversation: async (conversationId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'User not authenticated' }

    try {
      // Delete the conversation from Supabase
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      set(state => {
        const updatedConversations = state.conversations.filter(c => c.id !== conversationId)
        const needNewConversation = updatedConversations.length === 0 || 
          (state.currentConversationId === conversationId && !updatedConversations[0]?.id)

        // If this was the last conversation or we deleted the current conversation
        if (needNewConversation) {
          // Create a new conversation asynchronously
          get().createNewConversation()
          return {
            conversations: updatedConversations,
            currentConversationId: null,
            error: null
          }
        }

        // Update currentConversationId if we deleted the current conversation
        const newCurrentId = state.currentConversationId === conversationId
          ? updatedConversations[0]?.id
          : state.currentConversationId

        return {
          conversations: updatedConversations,
          currentConversationId: newCurrentId,
          error: null
        }
      })

      return { error: null }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      set({ error: `Failed to delete conversation: ${error.message}` })
      return { error: error.message }
    }
  },

  updateConversationTitle: async (conversationId, title) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId)
        .eq('user_id', user.id)

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

  selectConversation: async (conversationId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Get the latest conversation data from Supabase
      const { data: conversation, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      // Update the conversation in the store
      set(state => ({
        currentConversationId: conversationId,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, ...conversation } : conv
        )
      }))
    } catch (error) {
      console.error('Error selecting conversation:', error)
    }
  },

  setSelectedAgent: (agent) => {
    set({ selectedAgent: agent })
  },

  clearCurrentConversation: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const newConversation = await get().createNewConversation()
      if (!newConversation) throw new Error('Failed to create new conversation')

      set(state => ({
        currentConversationId: newConversation.id,
        conversations: [
          newConversation,
          ...state.conversations.filter(c => c.id !== newConversation.id)
        ]
      }))
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }
}))

export { useAgentStore }
