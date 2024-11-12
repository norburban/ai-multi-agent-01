import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const createAgent = (name, description) => {
  return {
    name,
    description,
    async process(message, conversation) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a ${name} agent. ${description}`
            },
            ...conversation.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: "user", content: message }
          ]
        })
        
        return response.choices[0].message.content
      } catch (error) {
        console.error('Error processing message:', error)
        return "Sorry, I couldn't process your message."
      }
    }
  }
}
