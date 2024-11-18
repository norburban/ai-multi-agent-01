import OpenAI from 'openai';

class APIClient {
  constructor(config = {}) {
    this.config = {
      apiType: 'openai', // 'openai' or 'custom'
      customApiUrl: '',
      customDeploymentName: '',
      customApiVersion: '',
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

      const apiVersion = this.config.customApiVersion;
      const url = `${this.config.customApiUrl}${this.config.customDeploymentName}/chat/completions?api-version=${apiVersion}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'client_id': this.config.clientId,
          'client_secret': this.config.clientSecret
        },
        body: JSON.stringify({
          messages: cleanedMessages
        })
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
}

export default APIClient;
