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
      customFullUrl: import.meta.env.VITE_CUSTOM_FULL_URL,
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

        // Check if the message is already in the context
        const messageExists = context.some(msg => 
          msg.role === 'user' && msg.content === message
        )

        const messages = [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          ...context,
          // Only append the message if it's not already in the context
          ...(messageExists ? [] : [{ role: "user", content: message }])
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

        // Removed updateMemory call as messages are stored in the global context
        return reply
      } catch (error) {
        console.error('API Error:', error)
        retries++
        if (error.name === 'AbortError') {
          throw new Error(`${this.name} agent timeout: Response took too long`)
        }
        if (retries === this.maxRetries) {
          const analyzedError = this.analyzeError(error);
          throw new Error(`${this.name} agent error after ${this.maxRetries} retries: ${analyzedError}`)
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retries)) // Exponential backoff
      }
    }
  }

  analyzeError(error) {
    try {
      // If error is already a string, return it
      if (typeof error === 'string') return error;
      
      // If error is an Error object with message
      if (error instanceof Error) {
        const errorStr = error.message;
        try {
          // Try to parse if the error message contains JSON
          if (errorStr.includes('{') && errorStr.includes('}')) {
            const match = errorStr.match(/\{[\s\S]*\}/);
            if (match) {
              const errorObj = JSON.parse(match[0]);
              if (errorObj.errorMessage?.error?.message) {
                return errorObj.errorMessage.error.message;
              }
            }
          }
        } catch (e) {
          // If JSON parsing fails, return original error message
          return errorStr;
        }
        return errorStr;
      }
      
      // If error is an object
      if (typeof error === 'object') {
        if (error.errorMessage?.error?.message) {
          return error.errorMessage.error.message;
        }
        if (error.message) {
          return error.message;
        }
      }
      
      // Fallback
      return JSON.stringify(error);
    } catch (e) {
      return 'Unknown error occurred';
    }
  }

  validateResponse(response) {
    return response && 
           typeof response === 'string' && 
           response.length > 0 &&
           response.length < 4000 // Reasonable length limit
  }

  getSystemPrompt() {
    const now = new Date();
    const utcTimestamp = now.toISOString();
    return `The current time is ${utcTimestamp} UTC.\n\nYou are a ${this.name}. ${this.description}\n${this.systemPrompt}\n\nFormat it based on the template.`
  }

  prepareContext(globalContext) {
    // Remove duplicates by using a Map with content as key
    const messageMap = new Map()
    
    // Process all messages maintaining chronological order
    const allMessages = [...globalContext, ...this.memory]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    // Keep only unique messages, with later ones overwriting earlier ones
    allMessages.forEach(msg => {
      const key = `${msg.role}-${msg.content}`
      messageMap.set(key, msg)
    })
    
    // Convert back to array and apply length limit
    const relevantContext = Array.from(messageMap.values())
      .slice(-this.maxMemoryLength)
    
    // Calculate token estimate (rough approximation)
    const contextString = JSON.stringify(relevantContext)
    const estimatedTokens = contextString.length / 4 // Rough estimate: 4 chars per token
    
    // If context is too large, keep most recent messages while maintaining order
    if (estimatedTokens > 2000) {
      return relevantContext.slice(Math.floor(relevantContext.length / 2))
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
