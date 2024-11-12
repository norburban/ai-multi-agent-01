import { create } from 'zustand'
import { ResearchAgent, WriterAgent, CriticAgent } from '../agents/SpecializedAgents'

const useAgentStore = create((set, get) => ({
  agents: [],
  conversation: [],
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
    } catch (error) {
      set({ error: error.message })
    }
  },

  setSelectedAgent: (agent) => {
    set({ selectedAgent: agent })
  },

  sendMessage: async (message) => {
    const { selectedAgent, conversation } = get()
    
    if (!selectedAgent) return

    set({ isProcessing: true, error: null })
    
    try {
      const updatedConversation = [...conversation, { 
        role: 'user', 
        content: message,
        timestamp: new Date().toISOString()
      }]
      set({ conversation: updatedConversation })

      // Process message with only the selected agent
      const response = await selectedAgent.process(message, updatedConversation)
      updatedConversation.push({
        role: 'assistant',
        agent: selectedAgent.name,
        content: response,
        timestamp: new Date().toISOString()
      })
      
      set({ conversation: updatedConversation })

      // Save conversation to localStorage
      localStorage.setItem('conversation', JSON.stringify(updatedConversation))
    } catch (error) {
      console.error('Error in agent processing:', error)
      set(state => ({
        error: error.message,
        conversation: [...state.conversation, {
          role: 'system',
          content: `Error: ${error.message}`,
          timestamp: new Date().toISOString()
        }]
      }))
    } finally {
      set({ isProcessing: false })
    }
  },

  loadSavedConversation: () => {
    try {
      const savedConversation = localStorage.getItem('conversation')
      if (savedConversation) {
        set({ conversation: JSON.parse(savedConversation) })
      }
    } catch (error) {
      console.error('Error loading saved conversation:', error)
    }
  },

  clearConversation: () => {
    const { agents } = get()
    agents.forEach(agent => agent.clearMemory())
    set({ conversation: [], error: null })
    localStorage.removeItem('conversation')
  }
}))

export { useAgentStore }
