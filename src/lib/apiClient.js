import OpenAI from 'openai';

class APIClient {
  constructor(config = {}) {
    this.config = {
      apiType: 'openai', // 'openai', 'mulesoft-stdai', 'mulesoft-genai', or 'custom'
      customFullUrl: '',
      clientId: '',
      clientSecret: '',
      ...config
    };

    if (this.config.apiType === 'openai') {
      this.openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    }

    // Detect Mulesoft API type from URL if not explicitly set
    if (this.config.customFullUrl && this.config.apiType === 'custom') {
      if (this.config.customFullUrl.includes('/openai/deployments')) {
        this.config.apiType = 'mulesoft-stdai';
      } else if (this.config.customFullUrl.includes('/genai')) {
        this.config.apiType = 'mulesoft-genai';
      }
    }
  }

  async createChatCompletion(messages) {
    if (this.config.apiType === 'openai') {
      return this.createOpenAIChatCompletion(messages);
    } else {
      return this.createCustomChatCompletion(messages);
    }
  }

  async createOpenAIChatCompletion(messages) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages
      });
      return {
        success: true,
        data: response,
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

  async createCustomChatCompletion(messages) {
    try {
      // Clean up messages to only include role and content
      const cleanedMessages = messages.map(({ role, content }) => ({
        role,
        content
      }));

      // Handle URL parameters without duplicating them
      const url = new URL(this.config.customFullUrl);
      if (!url.searchParams.has('api-version')) {
        url.searchParams.append('api-version', '2023-07-01-preview');
      }

      const requestBody = {
        messages: cleanedMessages
      };

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'client_id': this.config.clientId,
          'client_secret': this.config.clientSecret
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
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

  // Method for handling image-based requests
  async createImageBasedCompletion(imageBase64, prompt) {
    if (this.config.apiType !== 'mulesoft-genai') {
      throw new Error('Image-based completion is only supported with mulesoft-genai API type');
    }

    try {
      const messages = [{
        role: 'user',
        content: [
          {
            image: imageBase64
          },
          prompt
        ]
      }];

      return this.createCustomChatCompletion(messages);
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }
}

export default APIClient;
