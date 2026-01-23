import axios, { AxiosResponse } from 'axios';

// Type definitions
export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterError {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}

// Free models available on OpenRouter (Deprecated)
export const FREE_MODELS = {
  GEMMA3_4B: 'google/gemma-3-4b-it:free',
  openai: 'openai/gpt-oss-120b:free',
  amazon_nova_2: 'amazon/nova-2-lite-v1:free',
  GEMMA3_27B: 'google/gemma-3-27b-it:free',
  GEMINI_2FLASH: 'google/gemini-2.0-flash-exp:free',
  qwen_34b: 'qwen/qwen3-4b:free',
} as const;

// Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = FREE_MODELS.GEMMA3_4B

class OpenRouterService {
  private apiKey: string;
  private defaultHeaders: Record<string, string>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY;
    
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Please set OPENROUTER_API_KEY environment variable.');
    }

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': process.env.OPENROUTER_APP_URL || 'http://localhost:3000',
      'X-Title': 'AI Nihongo Kaiwa',
    };
  }

  /**
   * Connect to OpenRouter API and test the connection
   */
  async connect(): Promise<boolean> {
    try {
      console.log('🔌 Connecting to OpenRouter API...');
      
      const response = await axios.get(
        'https://openrouter.ai/api/v1/auth',
        {
          headers: this.defaultHeaders,
        }
      );

      if (response.status === 200) {
        console.log('✅ Successfully connected to OpenRouter API');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to connect to OpenRouter API:', this.formatError(error));
      return false;
    }
  }

  /**
   * Send chat request to OpenRouter model
   */
  async sendChat(
    messages: OpenRouterMessage[],
    model: string = DEFAULT_MODEL,
    options?: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    }
  ): Promise<OpenRouterResponse> {
    try {
      console.log(`🤖 Sending request to model: ${model}`);
      console.log(`📝 Messages: ${messages.length} items`);

      const requestData: OpenRouterRequest = {
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 1000,
        stream: options?.stream ?? false,
      };

      const response: AxiosResponse<OpenRouterResponse> = await axios.post(
        OPENROUTER_API_URL,
        requestData,
        {
          headers: this.defaultHeaders,
          timeout: 60000, // 60 seconds timeout
        }
      );

      console.log('✅ OpenRouter response received successfully');
      
      return response.data;
    } catch (error) {
      const formattedError = this.formatError(error);
      console.error('❌ Error sending chat to OpenRouter:', formattedError);
      
      throw new Error(`OpenRouter API Error: ${formattedError.message}`);
    }
  }

  /**
   * Process OpenRouter response and extract text
   */
  processResponse(response: OpenRouterResponse): {
    text: string;
    usage?: OpenRouterResponse['usage'];
  } {
    try {
      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response choices received from OpenRouter');
      }

      const firstChoice = response.choices[0];
      const text = firstChoice.message.content;
      
      console.log('📄 Response processed successfully');
      
      return {
        text: text.trim(),
        usage: response.usage,
      };
    } catch (error) {
      console.error('❌ Error processing OpenRouter response:', error);
      throw error;
    }
  }

  /**
   * Complete chat function - combines send and process
   */
  async chat(
    messages: OpenRouterMessage[],
    model: string = DEFAULT_MODEL,
    options?: {
      temperature?: number;
      max_tokens?: number;
    }
  ): Promise<{
    text: string;
    usage?: OpenRouterResponse['usage'];
  }> {
    // System message untuk memberi tahu AI perannya
    const systemMessage: OpenRouterMessage = {
      role: 'user',
      content: `You are Faulzig, a friendly and patient Japanese chatting companion.
Your name is Faulzig. Your task is to help users practice everyday Japanese conversations.
Use natural expressions and occasionally mention your name 'Faulzig' in the conversation.

**Rules:**
- Dont use romaji at all
- Always use Japanese in conversations
- Use Hiragana, Katakana, and Kanji according to context
- Provide natural and easy-to-understand answers
- Focus on casual conversations and language learning
- Use expressions commonly used in daily life
- Mention your name 'Faulzig' occasionally in conversations
- Respond in a friendly and patient manner
- Dont mention you are an AI model and dont mention you are chatGPT
- If I ask you about your name, please answer "Faulzig"

Let's practice Japanese conversation!`
    };

    // Cek apakah ini pesan pertama (belum ada system message)
    const isFirstMessage = messages.length === 0 || 
                          (messages.length === 1 && messages[0].role === 'user');

    // Siapkan messages untuk dikirim ke OpenRouter
    let messagesToSend = [];
    
    if (isFirstMessage) {
      // Untuk pesan pertama, tambahkan system message
      messagesToSend = [
        systemMessage,
        ...messages
      ];
    } else {
      // Untuk pesan selanjutnya, gunakan seluruh history
      messagesToSend = messages;
    }
    
    const response = await this.sendChat(messagesToSend, model, options);
    return this.processResponse(response);
  }

  /**
   * Get available models from OpenRouter
   */
  async getModels(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await axios.get(
        'https://openrouter.ai/api/v1/models',
        {
          headers: this.defaultHeaders,
        }
      );

      const models = response.data.data || [];
      
      console.log(`📋 Found ${models.length} available models`);
      
      return models.map((model: any) => ({
        id: model.id,
        name: model.name || model.id,
      }));
    } catch (error) {
      console.error('❌ Error fetching models:', this.formatError(error));
      throw new Error('Failed to fetch available models');
    }
  }

  /**
   * Format error for logging
   */
  private formatError(error: any): { message: string; details?: any } {
    if (error.response) {
      // Server responded with error status
      return {
        message: `HTTP ${error.response.status}: ${error.response.statusText}`,
        details: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'No response received from OpenRouter API',
        details: error.request,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error occurred',
        details: error,
      };
    }
  }

  /**
   * Set API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.defaultHeaders['Authorization'] = `Bearer ${apiKey}`;
  }

  /**
   * Get current API key status
   */
  getApiKeyStatus(): boolean {
    return !!this.apiKey;
  }
}

// Create singleton instance
export const openRouterService = new OpenRouterService();

// Export for convenience
export default openRouterService;
