import { create } from 'zustand'
import { ResearchAgent, WriterAgent, CriticAgent } from '../agents/SpecializedAgents'
import { supabase } from '../lib/supabase'
import { openai } from '../lib/openai'
import { v4 as uuidv4 } from 'uuid'

const useAgentStore = create((set, get) => ({
  agents: [],
  conversations: [],
  currentConversationId: null,
  selectedAgent: null,
  isProcessing: false,
  error: null,
  messages: [],

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

      // Create initial conversation if none exists
      const state = get()
      if (!state.conversations || state.conversations.length === 0) {
        const newConversation = {
          id: uuidv4(),
          title: 'New Chat',
          messages: []
        }
        set({ 
          conversations: [newConversation],
          currentConversationId: newConversation.id,
          messages: []
        })
      }

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
      }
    } catch (error) {
      console.error('Error initializing agents:', error)
      set({ error: error.message })
    }
  },

  createNewConversation: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newConversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      user_id: user.id
    }

    try {
      // First insert the conversation into Supabase
      const { error: insertError } = await supabase
        .from('conversations')
        .insert([newConversation])

      if (insertError) throw insertError

      // Then update local state
      set(state => ({ 
        conversations: [...state.conversations, newConversation],
        currentConversationId: newConversation.id,
        messages: []
      }))
    } catch (error) {
      console.error('Error creating conversation:', error)
      set({ error: error.message })
    }
  },

  setCurrentConversationId: (id) => {
    const state = get()
    const conversation = state.conversations.find(c => c.id === id)
    if (conversation) {
      set({ 
        currentConversationId: id,
        messages: conversation.messages
      })
    }
  },

  saveConversations: async () => {
    const state = get()
    const currentConversation = state.conversations.find(c => c.id === state.currentConversationId)
    
    if (!currentConversation) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Get the current conversation from Supabase first
      const { data: existingConv, error: fetchError } = await supabase
        .from('conversations')
        .select('messages')
        .eq('id', currentConversation.id)
        .eq('user_id', user.id)
        .single()

      if (fetchError) throw fetchError

      // Merge existing messages with new ones if needed
      const messages = currentConversation.messages || []
      
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          title: currentConversation.title || 'New Chat',
          messages: messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConversation.id)
        .eq('user_id', user.id)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Error saving conversation:', error)
      set({ error: error.message })
    }
  },

  sendMessage: async (content) => {
    const state = get()
    const { currentConversationId, conversations, selectedAgent } = state
    if (!currentConversationId) return
    if (!selectedAgent) {
      throw new Error('Please select an agent before sending a message')
    }

    set({ isProcessing: true })
    
    try {
      const userMessage = { 
        role: 'user', 
        content,
        timestamp: new Date().toISOString()
      }
      const updatedMessages = [...state.messages, userMessage]
      
      // Update conversation messages and title if it's the first message
      const currentConversation = conversations.find(c => c.id === currentConversationId)
      const isFirstMessage = currentConversation.messages.length === 0
      const updatedTitle = isFirstMessage ? content.slice(0, 50) : currentConversation.title
      
      const updatedConversations = conversations.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: updatedMessages, title: updatedTitle }
          : conv
      )

      set({ 
        messages: updatedMessages,
        conversations: updatedConversations
      })

      // Save the updated conversation to Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: updateError } = await supabase
          .from('conversations')
          .update({
            title: updatedTitle,
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversationId)
          .eq('user_id', user.id)

        if (updateError) throw updateError
      }

      // Get AI response using the selected agent
      const response = await selectedAgent.process(content, updatedMessages)

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        agent: selectedAgent.name
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      
      // Update conversation with AI response
      const finalConversations = conversations.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: finalMessages, title: updatedTitle }
          : conv
      )

      set({ 
        messages: finalMessages,
        conversations: finalConversations,
        isProcessing: false
      })

      // Save the final conversation with AI response to Supabase
      if (user) {
        const { error: saveError } = await supabase
          .from('conversations')
          .update({
            messages: finalMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversationId)
          .eq('user_id', user.id)

        if (saveError) throw saveError
      }
    } catch (error) {
      console.error('Error sending message:', error)
      set({ 
        error: error.message,
        isProcessing: false
      })
    }
  },

  deleteConversation: async (conversationId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      set({ error: 'User not authenticated' })
      return
    }

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id)

      if (error) throw error

      set(state => {
        const remainingConversations = state.conversations.filter(c => c.id !== conversationId)
        
        // If we're deleting the current conversation, select a new one
        let newCurrentId = state.currentConversationId
        if (state.currentConversationId === conversationId) {
          // Try to select the previous conversation, if not available, select the first one
          const currentIndex = state.conversations.findIndex(c => c.id === conversationId)
          newCurrentId = remainingConversations[currentIndex - 1]?.id || remainingConversations[0]?.id || null
        }

        // If no conversations left, create a new one
        if (remainingConversations.length === 0) {
          const newConversation = {
            id: uuidv4(),
            title: 'New Chat',
            messages: [],
            user_id: user.id
          }
          return {
            conversations: [newConversation],
            currentConversationId: newConversation.id,
            messages: [],
            error: null
          }
        }

        return {
          conversations: remainingConversations,
          currentConversationId: newCurrentId,
          error: null
        }
      })
    } catch (error) {
      console.error('Error deleting conversation:', error)
      set({ error: 'Failed to delete conversation. Please try again.' })
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

      // Parse messages if they're stored as a string
      const parsedMessages = Array.isArray(conversation.messages) 
        ? conversation.messages 
        : JSON.parse(conversation.messages || '[]')

      // Update the conversation in the store
      set(state => {
        const updatedConversation = { ...conversation, messages: parsedMessages }
        return {
          currentConversationId: conversationId,
          messages: parsedMessages,
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? updatedConversation : conv
          )
        }
      })
    } catch (error) {
      console.error('Error selecting conversation:', error)
      set({ error: 'Failed to load conversation. Please try again.' })
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
