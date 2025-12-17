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

// Free models available on OpenRouter
export const FREE_MODELS = {
  GEMMA2_9B: 'google/gemma-3-4b-it:free',
  LLAMA_3_2_1B: 'meta-llama/llama-3.2-1b-preview',
  LLAMA_3_2_3B: 'meta-llama/llama-3.2-3b-preview',
  PHI_3: 'microsoft/phi-3-mini-4k-instruct',
  CODEGEEX_4: 'thudm/codegeex4-all-9b',
} as const;

// Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = FREE_MODELS.GEMMA2_9B;

class OpenRouterService {
  private apiKey: string;
  private defaultHeaders: Record<string, string>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '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';
    
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
    model: string = 'google/gemma-3-4b-it:free',
    options?: {
      temperature?: number;
      max_tokens?: number;
    }
  ): Promise<{
    text: string;
    usage?: OpenRouterResponse['usage'];
  }> {
    // Add system message to set context for Japanese language learning
    const systemMessage: OpenRouterMessage = {
      role: 'user',
      content: `Anda adalah teman chatting bahasa Jepang yang ramah dan sabar.
      Tugas Anda adalah membantu pengguna berlatih percakapan bahasa Jepang sehari-hari.
      - Selalu gunakan bahasa Jepang dalam percakapan
      - Gunakan huruf Hiragana, Katakana, dan Kanji sesuai konteks
      - Berikan jawaban yang alami dan mudah dipahami
      - Jangan gunakan bahasa Indonesia dalam respons Anda
      - Fokus pada percakapan santai dan pembelajaran bahasa
      - Gunakan ekspresi yang umum digunakan dalam kehidupan sehari-hari
      - Tidak perlu menulis romajinya (Kecuali jika diminta)
      
      日本語で会話練習をしましょう！`
    };

    const messagesWithSystem = [systemMessage, ...messages];
    
    const response = await this.sendChat(messages, model, options);
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