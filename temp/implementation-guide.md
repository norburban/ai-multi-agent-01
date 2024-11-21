# Implementation Guide for Nestle GenAI Integration

## 1. Environment Variables Setup
Add to `.env`:
```
VITE_API_TYPE=custom
VITE_CUSTOM_FULL_URL=https://eur-sdr-int-pub.nestle.com/api/dv-exp-sandbox-openai-api/1/genai/Azure/gptv/completions
VITE_CUSTOM_CLIENT_ID=your_client_id
VITE_CUSTOM_CLIENT_SECRET=your_client_secret
```

## 2. Modify apiClient.js

```javascript
class APIClient {
  constructor(config = {}) {
    this.config = {
      apiType: 'openai',
      customFullUrl: '',
      clientId: '',
      clientSecret: '',
      apiVersion: '2023-07-01-preview', // Add API version
      ...config
    };
  }

  async createCustomChatCompletion(messages) {
    try {
      const cleanedMessages = messages.map(message => {
        // Handle multimodal content
        if (Array.isArray(message.content)) {
          return {
            role: message.role,
            content: message.content.map(item => {
              if (item.image) {
                return { image: item.image };
              }
              return item;
            })
          };
        }
        return { role: message.role, content: message.content };
      });

      const response = await fetch(`${this.config.customFullUrl}?api-version=${this.config.apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'client_id': this.config.clientId,
          'client_secret': this.config.clientSecret
        },
        body: JSON.stringify({ messages: cleanedMessages })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  // Add method for image encoding
  async encodeImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }
}
```

## 3. Modify BaseAgent.js

```javascript
export class BaseAgent {
  constructor(name, description, systemPrompt) {
    // ... existing constructor
    this.apiClient = new APIClient({
      apiType: 'custom',
      customFullUrl: import.meta.env.VITE_CUSTOM_FULL_URL,
      clientId: import.meta.env.VITE_CUSTOM_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CUSTOM_CLIENT_SECRET,
      apiVersion: '2023-07-01-preview'
    });
  }

  // Add method for handling image inputs
  async processWithImage(message, imageFile, globalContext = []) {
    const base64Image = await this.apiClient.encodeImage(imageFile);
    const multimodalMessage = {
      role: 'user',
      content: [
        { image: base64Image },
        message
      ]
    };
    return this.process(multimodalMessage, globalContext);
  }

  // Modify process method to handle multimodal content
  async process(message, globalContext = []) {
    // ... existing try-catch block
    const messages = [
      {
        role: "system",
        content: this.getSystemPrompt()
      },
      ...context,
      // Handle both string and multimodal messages
      ...(messageExists ? [] : [
        typeof message === 'string' 
          ? { role: "user", content: message }
          : message
      ])
    ];
    // ... rest of the method
  }
}
```

## 4. Usage Example

```javascript
// In your React component
import { BaseAgent } from './agents/BaseAgent';

const agent = new BaseAgent(
  'Vision Assistant',
  'An AI assistant that can analyze images',
  'You are a vision-capable AI assistant that helps analyze images.'
);

// For text-only queries
const textResponse = await agent.process("Hello, how are you?");

// For image analysis
const imageFile = event.target.files[0];
const imageResponse = await agent.processWithImage(
  "Describe this image",
  imageFile
);
```