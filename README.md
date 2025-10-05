# chatbot-Botcore
ai chatbot 
<img width="1590" height="775" alt="image" src="https://github.com/user-attachments/assets/c590bc28-36f0-425c-ae24-b0861539815f" />


A modern, responsive web-based conversational AI chatbot powered by Google's Gemini API. Built with HTML, CSS, and JavaScript, it features a sleek dark/light theme toggle, chat history management, image upload for multimodal queries, and a customizable system prompt for engaging, witty responses. Designed for personal assistance with a focus on multilingual support (English, Roman Urdu, Roman Hindi) and adaptive tone (friendly by default, savage on swear words).
    
  Live Demo: https://botcore-ai-chatbot.netlify.app/


🚀 Features

Gemini 2.5 Flash AI for fast, multimodal chats.

History management (save/rename/delete).

Dark/light themes; auto-resize input

Markdown support; copy messages; stop generation.

Adaptive tone: Friendly default, savage on swears.

📋 Prerequisites

Browser (modern).

Gemini API key – Replace in script.js Line ~15.

Node.js

▶️ Running the App
Serve the files locally to avoid CORS issues with API calls.
Option 1: VS Code Live Server (Recommended for Development)

Install the "Live Server" extension in VS Code.
Open the project folder in VS Code.
Right-click index.html > Open with Live Server.
Opens at http://127.0.0.1:5500/index.html with live reload on changes.

Option 2: Node.js HTTP Server
textnpx http-server . -p 8080
Open http://localhost:8080.
Option 3: Python (If Installed)
textpython -m http.server 8000
Open http://localhost:8000.
Quick Test (No Server)
Double-click index.html to open in browser (UI works, but API may fail due to CORS—use a server for full functionality).

💬 Usage

Start Chatting:

The app loads with a new conversation and initial greeting.
Type a message in the input field and press Enter (or click send icon).


Upload Images:

Click the image icon next to the input.
Select a file (JPEG/PNG supported)—preview appears.
Send with optional text for analysis (e.g., "What's in this photo?").


Manage Chats:

Click + New Chat for a fresh conversation.
Hover over history items for rename (✏️) / delete (🗑️) icons.
Click a history item to switch chats.


Customize:

Toggle theme in sidebar footer.
Edit systemInstruction in script.js for personality tweaks.












































