import APIClient from '../lib/apiClient';
// Touch to update features

export class BaseAgent {
  constructor(name, description, systemPrompt) {
    this.name = name
    this.description = description
    this.systemPrompt = systemPrompt
    this.maxRetries = 3
    this.timeout = 30000 // 30 seconds
    this.memory = []
    this.maxMemoryLength = 10
    this.apiClient = new APIClient({
      apiType: import.meta.env.VITE_API_TYPE || 'openai',
      customApiUrl: import.meta.env.VITE_CUSTOM_API_URL,
      customDeploymentName: import.meta.env.VITE_CUSTOM_DEPLOYMENT_NAME,
      customApiVersion: import.meta.env.VITE_CUSTOM_API_VERSION,
      clientId: import.meta.env.VITE_CUSTOM_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CUSTOM_CLIENT_SECRET
    })
  }

  async process(message, globalContext = []) {
    let retries = 0
    
    while (retries < this.maxRetries) {
      try {
        const context = this.prepareContext(globalContext)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const messages = [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          ...context,
          { role: "user", content: message }
        ]

        const response = await this.apiClient.createChatCompletion(messages)
        clearTimeout(timeoutId)

        if (!response.success) {
          throw new Error(response.error)
        }

        const reply = response.data.choices[0].message.content
        if (!this.validateResponse(reply)) {
          throw new Error('Invalid response format')
        }

        this.updateMemory({ role: 'assistant', content: reply })
        return reply
      } catch (error) {
        console.error('API Error:', error)
        retries++
        if (error.name === 'AbortError') {
          throw new Error(`${this.name} agent timeout: Response took too long`)
        }
        if (retries === this.maxRetries) {
          throw new Error(`${this.name} agent error after ${this.maxRetries} retries: ${error.message}`)
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)) // Exponential backoff
      }
    }
  }

  validateResponse(response) {
    return response && 
           typeof response === 'string' && 
           response.length > 0 &&
           response.length < 4000 // Reasonable length limit
  }

  getSystemPrompt() {
    return `You are ${this.name}. ${this.description}\n${this.systemPrompt}\n\nImportant guidelines:
    1. Be concise but thorough
    2. Focus on accuracy and relevance
    3. Maintain professional tone
    4. Cite sources when applicable
    5. Avoid repetition and redundancy`
  }

  prepareContext(globalContext) {
    // Combine global and agent-specific context, prioritizing recent messages
    const relevantContext = [...globalContext, ...this.memory]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, this.maxMemoryLength)
    
    // Calculate token estimate (rough approximation)
    const contextString = JSON.stringify(relevantContext)
    const estimatedTokens = contextString.length / 4 // Rough estimate: 4 chars per token
    
    // If context is too large, prioritize most recent messages
    if (estimatedTokens > 2000) {
      return relevantContext.slice(0, Math.floor(relevantContext.length / 2))
    }
    
    return relevantContext
  }

  updateMemory(message) {
    message.timestamp = new Date().toISOString()
    this.memory.push(message)
    if (this.memory.length > this.maxMemoryLength) {
      this.memory.shift()
    }
  }

  clearMemory() {
    this.memory = []
  }
}
