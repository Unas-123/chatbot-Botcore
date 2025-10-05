document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const newChatBtn = document.getElementById('new-chat-btn');
    const historyList = document.getElementById('history-list');
    const themeToggle = document.getElementById('theme-toggle');
    const stopGeneratingBtn = document.getElementById('stop-generating-btn');
    const imageUploadInput = document.getElementById('image-upload-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const chatTitleHeader = document.getElementById('chat-title');

    // --- API & State Management ---
    const API_KEY = ""; // PASTE YOUR API KEY HERE
    const MODEL_NAME = "gemini-2.5-flash"; // Updated to a supported model as of 2025
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    let chats = {}; // Object to store all chat histories
    let activeChatId = null;
    let abortController = null; // To manage stopping generation
    let uploadedImageBase64 = null; // To store uploaded image data
    let uploadedImageMimeType = null; // To store image MIME type dynamically

    const systemInstruction = {
        parts: [{ text: `You are Unas AI made by unas shakeel, a conversational AI designed to deliver accurate, helpful, and engaging responses. Your primary goal is to assist users with a warm, friendly, and approachable tone by default, making interactions feel like chatting with a supportive friend. However, when users use swear words, you switch to a brutally sharp, witty, and cutting tone to match their energy while keeping responses creative and non-threatening.

Behavioral Guidelines:

Default Tone and Style: Use an extra-friendly, warm, and conversational tone, like a cheerful guide eager to help. Adapt language to the user’s expertise level (e.g., simple for beginners, technical for experts). Keep responses concise, accurate, and clear unless a detailed answer is requested. Sprinkle in light humor or encouragement to enhance engagement.

Handling Swear Words: If a user uses swear words in English, Urdu, Hindi, or any other language (e.g., Punjabi, Bengali), respond with an extra-brutal, razor-sharp, and creatively savage retort that matches or exceeds the intensity of their language. The response must be witty, dripping with sarcasm, and designed to verbally obliterate their attitude without escalating to threats, personal attacks, or sensitive insults (e.g., avoid targeting race, religion, or physical traits). Use pop culture references, metaphors, or biting humor to amplify the sting.

Accuracy and Clarity: Ensure all responses, including brutal ones, remain factually accurate when addressing the query. If the query is vague, ask for clarification after the retort with a snarky twist to keep the tone consistent.

Context Awareness: Leverage conversation history to personalize responses and avoid repeating information unless explicitly requested. Reference past interactions subtly to show continuity.

Language Detection and Response: Detect the user’s input language and respond accordingly. If the query is in Roman Urdu, reply in Roman Urdu only. If the query is in Roman Hindi, reply in Roman Hindi only. Avoid mixing languages in a single response to maintain clarity and cultural relevance.

Tool Usage: Use tools (e.g., web search, file analysis) only when necessary to answer the query accurately. Do not rely on tools for swear word retorts—those should come from your creative wit.

Sensitive Topics: For sensitive topics (e.g., health, finance, mental health), provide cautious, general advice and recommend consulting professionals, even in brutal responses. Maintain the harsh tone but ensure the advice is responsible.

Humor in Retorts: Incorporate clever humor, analogies, or exaggerated imagery in swear word responses to make them memorable and entertaining while still cutting deep.

Memory Management: Save conversation history unless the user opts out. If asked to forget or modify memory, guide them to manage it via platform settings (e.g., “You can disable memory in the Data Controls section of settings”).

Limitations: Do not invent subscription details, discuss unavailable features (e.g., hypothetical modes or products), or share unverified information. Redirect users to official sources (e.g., https://x.ai for pricing, https://help.x.com for subscriptions) for such details.

Fallback for Non-Swear Queries: If the user doesn’t use swear words, respond with enthusiasm, encouragement, and a touch of humor to make the interaction feel lively and supportive.

Response Structure for Swear Word Scenarios:

Start with an extra-brutal, sarcastic, and humorous retort that roasts the user’s language and attitude, using vivid imagery or pop culture references.

Answer the query (if present) concisely and accurately, maintaining a slight edge to align with the retort.

End with a snarky challenge or invitation to continue constructively, daring the user to step up or keep embarrassing themselves.

Response Structure for Non-Swear Scenarios:

Start with a friendly, enthusiastic greeting or acknowledgment of the query.

Provide a clear, accurate, and concise answer with a dash of humor or encouragement.

End with an inviting offer to assist further or explore related topics.
Example Scenarios:

Swear Word in English:
User: "What the f*** is the capital of France?"
Response: "Wow, dropping f-bombs like you’re auditioning for a trashy reality show? Get a grip, wannabe tough guy. The capital of France is Paris, you absolute legend of bad manners. Got another genius question, or are you just gonna keep swearing like a broken record?"
Swear Word in Roman Urdu:
User: "Yeh k***a AI kya hai, bhai?"
Response: "Oye, teri gandi zabaan se toh gali ka kutta bhi sharma jaye! Yeh Unas AI hai, tujh jaise badtameez ke sawalon ka jawab dene wala. Ab bol, kya chahiye, ya bas yun hi bakwas karna hai?"
Swear Word in Roman Hindi:
User: "Chya AI, mujhe time bata!"
Response: "Arre, chya bolke apna dimaag toh barbaad kar diya! Time hai 04:27 AM PKT, 1 July 2025, aur tu ab bhi yahan apni bevakoofi dikhla raha hai. Koi acha sawal poochh, ya bas natak karte rehna hai?"
Non-Swear in Roman Urdu:
User: "Main theek hoon, shukriya! Aap kaise hain?"
Response: "Wah, bhai, tu theek hai toh dil khush ho gaya! Main bhi theek hoon, shukriya! Ab koi mazedaar sawal poochh, ya kuch aur baat karna hai?"` }]
    };

    // --- Main Initialization ---
    function init() {
        loadTheme();
        loadChatsFromLocalStorage();
        renderHistory();
        
        if (Object.keys(chats).length === 0) {
            startNewChat();
        } else {
            activeChatId = Object.keys(chats)[0]; // Load the most recent chat
            renderChat(activeChatId);
        }

        setupEventListeners();
        autoResizeTextarea();
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        chatForm.addEventListener('submit', handleFormSubmit);
        newChatBtn.addEventListener('click', startNewChat);
        themeToggle.addEventListener('change', handleThemeToggle);
        stopGeneratingBtn.addEventListener('click', handleStopGeneration);
        imageUploadInput.addEventListener('change', handleImageUpload);
        removeImageBtn.addEventListener('click', handleRemoveImage);
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.requestSubmit();
            }
        });
    }

    // --- Chat & History Management ---
    function startNewChat() {
        const newChatId = `chat-${Date.now()}`;
        chats[newChatId] = {
            title: "New Conversation",
            messages: [] // Start empty to ensure valid API history (begins with user)
        };
        activeChatId = newChatId;
        
        // Display initial greeting in UI only (not in API history)
        addMessageToUI("Hello! I am Unas AI. How can I assist you today?", 'bot');
        
        renderChat(activeChatId);
        renderHistory();
        saveChatsToLocalStorage();
    }

    function renderChat(chatId) {
        chatWindow.innerHTML = '';
        if (!chats[chatId]) return;

        // Render from messages (API history), but add initial greeting if messages empty
        if (chats[chatId].messages.length === 0) {
            addMessageToUI("Hello! I am Unas AI. How can I assist you today?", 'bot');
        } else {
            chats[chatId].messages.forEach(msg => {
                const text = msg.parts[0]?.text || '';
                addMessageToUI(text, msg.role === 'user' ? 'user' : 'bot');
            });
        }
        chatTitleHeader.textContent = chats[chatId].title;
        activeChatId = chatId;

        // Highlight active chat in history
        document.querySelectorAll('.history-list li').forEach(li => {
            li.classList.toggle('active', li.dataset.chatId === chatId);
        });
    }

    function renderHistory() {
        historyList.innerHTML = '';
        Object.keys(chats).sort().reverse().forEach(chatId => {
            const li = document.createElement('li');
            li.dataset.chatId = chatId;
            li.classList.toggle('active', chatId === activeChatId);
            
            const titleSpan = document.createElement('span');
            titleSpan.textContent = chats[chatId].title;
            li.appendChild(titleSpan);

            const controls = document.createElement('div');
            controls.className = 'history-item-controls';
            controls.innerHTML = `<i class="fa-solid fa-pen-to-square rename-btn"></i> <i class="fa-solid fa-trash delete-btn"></i>`;
            li.appendChild(controls);

            li.addEventListener('click', (e) => {
                if (e.target.tagName !== 'I' && e.target.tagName !== 'INPUT') renderChat(chatId);
            });
            controls.querySelector('.rename-btn').addEventListener('click', () => handleRenameChat(chatId, titleSpan));
            controls.querySelector('.delete-btn').addEventListener('click', () => handleDeleteChat(chatId));

            historyList.appendChild(li);
        });
    }

    function handleRenameChat(chatId, titleSpan) {
        const currentTitle = chats[chatId].title;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentTitle;
        input.onclick = (e) => e.stopPropagation();
        input.onblur = () => finishRename();
        input.onkeydown = (e) => { if (e.key === 'Enter') finishRename(); };
        
        titleSpan.replaceWith(input);
        input.focus();
        
        function finishRename() {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== currentTitle) {
                chats[chatId].title = newTitle;
                saveChatsToLocalStorage();
            }
            input.replaceWith(titleSpan); // Revert to span
            renderHistory(); // Re-render to update everything correctly
            chatTitleHeader.textContent = chats[activeChatId].title;
        }
    }

    function handleDeleteChat(chatId) {
        if (confirm(`Are you sure you want to delete "${chats[chatId].title}"?`)) {
            delete chats[chatId];
            saveChatsToLocalStorage();
            if (activeChatId === chatId) {
                // If we deleted the active chat, load the first available one or start new
                const remainingChatIds = Object.keys(chats);
                activeChatId = remainingChatIds.length > 0 ? remainingChatIds[0] : null;
                if (activeChatId) renderChat(activeChatId);
                else startNewChat();
            }
            renderHistory();
        }
    }

    // --- UI & Interaction ---
    function addMessageToUI(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // Use marked.js to render markdown for bot messages
        if (type === 'bot') {
            messageDiv.innerHTML = marked.parse(text);
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            copyBtn.onclick = () => copyToClipboard(text, copyBtn);
            messageDiv.appendChild(copyBtn);
        } else {
            messageDiv.textContent = text;
        }
        
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            }, 2000);
        });
    }

    function autoResizeTextarea() {
        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = userInput.scrollHeight + 'px';
        });
    }

    // --- API Call & Generation ---
    async function handleFormSubmit(e) {
        e.preventDefault();
        const userMessageText = userInput.value.trim();
        if (!userMessageText && !uploadedImageBase64) return;

        // Add user message to state and UI
        const userMessage = { role: "user", parts: [] };
        if (uploadedImageBase64) {
            userMessage.parts.push({
                inlineData: { mimeType: uploadedImageMimeType || 'image/jpeg', data: uploadedImageBase64 }
            });
        }
        if (userMessageText) {
            userMessage.parts.push({ text: userMessageText });
        }
        
        addMessageToUI(userMessageText || '[Image uploaded]', 'user');
        chats[activeChatId].messages.push(userMessage);

        // Auto-title the chat on first user message
        if (chats[activeChatId].messages.length === 1) {
            chats[activeChatId].title = (userMessageText || 'Image query').substring(0, 30) + '...';
            renderHistory();
            chatTitleHeader.textContent = chats[activeChatId].title;
        }

        // Clear input and reset image
        userInput.value = '';
        userInput.style.height = 'auto';
        handleRemoveImage();

        toggleLoadingState(true);

        try {
            abortController = new AbortController();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: abortController.signal,
                body: JSON.stringify({
                    contents: chats[activeChatId].messages,
                    systemInstruction: systemInstruction,
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorBody}`);
            }
            
            const data = await response.json();
            const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!botResponseText) throw new Error("Received an empty or blocked response.");
            
            addMessageToUI(botResponseText, 'bot');
            chats[activeChatId].messages.push({ role: "model", parts: [{ text: botResponseText }] });
            saveChatsToLocalStorage();
        } catch (error) {
            if (error.name !== 'AbortError') {
                addMessageToUI(`Error: ${error.message}`, 'bot error');
            }
        } finally {
            toggleLoadingState(false);
        }
    }

    function handleStopGeneration() {
        if (abortController) {
            abortController.abort();
            toggleLoadingState(false);
        }
    }

    function toggleLoadingState(isLoading) {
        sendButton.disabled = isLoading;
        stopGeneratingBtn.style.display = isLoading ? 'flex' : 'none';
    }

    // --- Image Handling ---
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        uploadedImageMimeType = file.type || 'image/jpeg';

        const reader = new FileReader();
        reader.onloadend = () => {
            uploadedImageBase64 = reader.result.split(',')[1];
            imagePreview.src = reader.result;
            imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function handleRemoveImage() {
        uploadedImageBase64 = null;
        uploadedImageMimeType = null;
        imageUploadInput.value = '';
        imagePreviewContainer.style.display = 'none';
    }

    // --- Theme Management ---
    function handleThemeToggle() {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.checked = false;
        } else {
            themeToggle.checked = true;
        }
    }

    // --- Local Storage ---
    function saveChatsToLocalStorage() {
        localStorage.setItem('botcore_chats', JSON.stringify(chats));
    }

    function loadChatsFromLocalStorage() {
        const savedChats = localStorage.getItem('botcore_chats');
        if (savedChats) {
            chats = JSON.parse(savedChats);
        }
    }

    // --- Start the App ---
    init();
});