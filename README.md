# AI Nihongo Kaiwa - Japanese Conversation Practice Application

Web application for practicing Japanese conversations using AI and Web Speech API. This application allows users to speak in Indonesian and receive responses in Japanese.

## Features

- 🎤 **Speech-to-Text**: Converts user voice to text
- 🤖 **AI Chatbot**: Chat with AI in Japanese
- 🔊 **Text-to-Speech**: Listen to AI responses in Japanese voice
- 📱 **Responsive**: Can be used on various devices
- 💸 **Free**: All components use free technology

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - JavaScript superset with type checking
- **Express** - Minimal web framework
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Page structure
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Application logic
- **Web Speech API** - Speech-to-Text and Text-to-Speech

## Installation

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd AI-nihongo-kaiwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Or build first then run
   npm run build
   npm start
   ```

4. **Open browser**
   Open http://localhost:3000 in your browser

## Project Structure

```
AI-nihongo-kaiwa/
├── src/                 # TypeScript source code
│   └── index.ts        # Main server
├── public/             # Frontend static files
│   └── index.html      # Main page
├── node_modules/       # Dependencies
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
├── nodemon.json        # Nodemon configuration
└── README.md          # Documentation
```

## Usage

1. **Open the application** in a modern browser (Chrome/Edge recommended)
2. **Click the record button** to start speaking
3. **Speak in Indonesian** about any topic
4. **Listen to AI response** in Japanese
5. **Continue the conversation** as desired

## Supported Browsers

- ✅ **Google Chrome** (Recommended)
- ✅ **Microsoft Edge**
- ⚠️ **Firefox** (Partial features)
- ❌ **Safari** (Does not support Web Speech API)

## Important Notes

- This application uses Web Speech API which is **free and offline**
- For the best experience, use Chrome or Edge browser
- Microphone and speaker are required for voice features
- This application is still under development

## Contribution

1. Fork this repository
2. Create a new branch (`git checkout -b new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please contact:
- Email: [your-email@example.com]
- GitHub: [@username](https://github.com/username)

---

**Happy learning Japanese!** 🎌