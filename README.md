# BotCore - Unas AI Chatbot!

![Screenshot 2025-07-01 171933](https://github.com/user-attachments/assets/4c715e67-f475-40b5-b97f-00dee0aeebb4)
A feature-rich, modern web interface for the Google Gemini API, featuring the "Unas AI" persona. This project provides a fully functional chat application that persists conversation history and supports advanced features like image uploads, markdown rendering, and theme switching.
**Tagline:** _AI at the Heart of Every Conversation._

---
## ✨ Features
This application is more than just a simple API wrapper. It includes a suite of features designed for a premium user experience:

*   **💬 Full Chat History:** Conversations are automatically saved to your browser's `localStorage` and persist across sessions.
*   **📚 History Management:** Easily **rename** and **delete** past conversations from the sidebar.
*   **🖼️ Multimodal Input:** Upload images and ask questions about them, leveraging the power of Gemini's multimodal capabilities.
*   **✍️ Markdown Rendering:** AI responses are beautifully formatted with support for lists, bold/italic text, and code blocks.
*   **✂️ Copy to Clipboard:** A convenient one-click button to copy the AI's responses, perfect for code snippets.
*   **🛑 Stop Generation:** Instantly cancel an in-progress AI response if it's not what you wanted.
*   **🌗 Light/Dark Mode:** A sleek theme switcher to toggle between a dark, focused interface and a clean, light one.
*   **📱 Responsive Design:** The interface adapts smoothly to both desktop and mobile screen sizes.
---
## 🛠️ Technology Stack
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **AI API:** Google Gemini Pro API
*   **Libraries:**
    *   [marked.js](https://marked.js.org/): For rendering Markdown in AI responses.
    *   [Font Awesome](https://fontawesome.com/): For a clean and consistent icon set.
---
## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and `npm` installed on your computer. This project uses `npm` to manage dependencies and run a development server.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd YOUR_REPOSITORY_NAME
    ```
3.  **Install dependencies:**
    *(Even if there are no packages in `package.json` yet, this is a standard step for Node.js projects.)*
    ```bash
    npm install
    ```
### Configuration
This is the most important step. You need to add your Google Gemini API key to the project.

1.  Open the `script.js` file.
2.  Find the following line (near the top):
    ```javascript
    const API_KEY = "YOUR_API_KEY_HERE";
    ```
3.  Replace `"YOUR_API_KEY_HERE"` with your actual API key.
> **⚠️ Security Warning:**
> Do **NOT** commit or share your API key publicly. The current setup exposes the key in the client-side JavaScript. For a real-world application, this key should be managed by a secure backend server.
### Usage
The recommended way to run the project is with a live server to avoid potential browser security issues with local files.
1.  **Install `live-server` globally (if you haven't already):**
    ```bash
    npm install -g live-server
    ```
2.  **Start the server from your project directory:**
    ```bash
    live-server                                                                                                                                                             
    ```
    Your browser should automatically open to the application.
    review live: https://unas-123.github.io/chatbot-Botcore/
