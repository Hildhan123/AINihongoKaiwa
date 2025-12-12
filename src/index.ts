import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { openRouterService, OpenRouterMessage, FREE_MODELS } from './services/openrouter.js';

// Mendapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/status', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'online',
    message: 'AI Nihongo Kaiwa Server is running',
    version: '1.0.0'
  });
});

// OpenRouter Chat API
app.post('/api/openrouter/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { messages, model, temperature, maxTokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request format. Messages array is required.'
      });
    }

    console.log('📨 Received chat request:', {
      model: model || 'google/gemma-3-4b-it:free',
      messagesCount: messages.length,
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 1000
    });

    // Kirim ke OpenRouter
    const response = await openRouterService.chat(
      messages,
      model || 'google/gemma-3-4b-it:free',
      {
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 1000
      }
    );

    console.log('✅ Chat response sent successfully');

    res.json({
      success: true,
      text: response.text,
      usage: response.usage
    });

  } catch (error: any) {
    console.error('❌ Chat API Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat request'
    });
  }
});

// OpenRouter Status API
app.get('/api/openrouter/status', async (req: express.Request, res: express.Response) => {
  try {
    const isConnected = await openRouterService.connect();
    
    res.json({
      success: true,
      connected: isConnected,
      apiKeySet: !!process.env.OPENROUTER_API_KEY
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      connected: false,
      error: error.message
    });
  }
});

// OpenRouter Models API
app.get('/api/openrouter/models', async (req: express.Request, res: express.Response) => {
  try {
    const models = await openRouterService.getModels();
    
    res.json({
      success: true,
      models
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Set API Key (for development)
app.post('/api/openrouter/set-key', (req: express.Request, res: express.Response) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required'
      });
    }

    // Set environment variable
    process.env.OPENROUTER_API_KEY = apiKey;
    
    res.json({
      success: true,
      message: 'API key set successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve frontend
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log('Tekan Ctrl+C untuk menghentikan server');
});

export default app;