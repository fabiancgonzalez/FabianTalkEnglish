// Variables globales
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;
let starting = false;
let conversationHistory = [];
let conversationContext = [];

// URL base del API - detecta la ruta base automáticamente
const getBasePath = () => {
    const path = window.location.pathname;
    // Si estamos en /fabiantalkenglish/, usar esa base
    if (path.startsWith('/fabiantalkenglish')) {
        return '/fabiantalkenglish';
    }
    return '';
};
// Allow an explicit override when hosting the static site on a provider
// that doesn't run the Node backend (e.g., WNPower). Set `window.__API_BASE__`
// in the page to point to an external API host (no trailing slash).
const DEFAULT_API_BASE = getBasePath();
const API_BASE_URL = (window.__API_BASE__ && String(window.__API_BASE__).replace(/\/$/, '')) || DEFAULT_API_BASE;

// Helper: fetch con timeout
function fetchWithTimeout(url, options = {}, timeout = 10000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
    ]);
}

// Elementos del DOM
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const userSubtitle = document.getElementById('userSubtitle');
const aiSubtitle = document.getElementById('aiSubtitle');
const userSpanish = document.getElementById('userSpanish');
const aiSpanish = document.getElementById('aiSpanish');
const historyContainer = document.getElementById('historyContainer');
const statusText = document.getElementById('statusText');
const statusIndicator = document.getElementById('statusIndicator');
const aiStatus = document.getElementById('aiStatus');
const enableVoice = document.getElementById('enableVoice');
const voiceSpeed = document.getElementById('voiceSpeed');
const speedValue = document.getElementById('speedValue');

// Inicializar reconocimiento de voz
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Lo siento, tu navegador no soporta reconocimiento de voz. Por favor usa Chrome, Edge o Safari.');
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        console.log('Speech recognition started');
        starting = false;
        isListening = true;
        
    recognition.continuous = true;
        updateStatus('Listening...', 'listening');
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Mostrar transcripción en tiempo real
        if (interimTranscript) {
            console.log('Interim transcript:', interimTranscript);
            userSubtitle.textContent = interimTranscript;
            userSubtitle.style.opacity = '0.7';
        }
        
        // Cuando la frase está completa, procesar
        if (finalTranscript && finalTranscript.trim().length > 0) {
            console.log('Final transcript:', finalTranscript);
            userSubtitle.textContent = finalTranscript;
            userSubtitle.style.opacity = '1';
            processUserMessage(finalTranscript.trim());
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event);
        // Manejo específico de errores comunes
        if (event.error === 'no-speech') {
            updateStatus('No speech detected. Keep talking...', 'active');
        } else if (event.error === 'network') {
            updateStatus('Network error. Check your connection.', 'error');
            stopListening();
        } else if (event.error === 'aborted') {
            // Abort indica que la captura fue interrumpida; no reiniciamos automáticamente
            updateStatus('Recognition aborted. Please press Start to retry.', 'error');
            console.warn('Recognition aborted, not auto-restarting');
            starting = false;
            isListening = false;
            startBtn.disabled = false;
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            updateStatus('Microphone access denied. Allow microphone and reload.', 'error');
            alert('Acceso al micrófono denegado. Por favor permite el acceso y recarga la página.');
            startBtn.disabled = false;
            starting = false;
        } else {
            updateStatus(`Error: ${event.error}`, 'error');
        }
    };
    
    recognition.onend = () => {
        starting = false;
        // No reiniciamos automáticamente para evitar bucles. Usuario debe iniciar manualmente.
        isListening = false;
        updateStatus('Stopped', 'inactive');
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
    
    return true;
}

// Procesar mensaje del usuario
async function processUserMessage(text) {
    // Traducir mensaje del usuario
    const userTranslation = await translateText(text);
    userSpanish.textContent = userTranslation;
    
    // Agregar al contexto
    conversationContext.push({
        role: 'user',
        content: text
    });
    
    // Obtener respuesta de la IA
    await getAIResponse(text);
}

// Obtener respuesta de la IA usando el backend
async function getAIResponse(userMessage) {
    try {
        aiStatus.textContent = 'Thinking...';
        aiSubtitle.textContent = 'Thinking...';
        aiSubtitle.style.opacity = '0.7';
        
        console.log('Calling backend /api/chat', { url: `${API_BASE_URL}/api/chat`, message: userMessage, contextLength: conversationContext.length });
        // Llamar al backend (con timeout)
        const response = await fetchWithTimeout(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                conversationContext: conversationContext.slice(-10)
            })
        });
        
        let aiResponse;
        
        if (response.ok) {
            const data = await response.json();
            aiResponse = data.response || generateSimpleResponse(userMessage);
        } else {
            console.error('Backend API error:', await response.text());
            // Respuesta de respaldo
            aiResponse = generateSimpleResponse(userMessage);
        }
        
        // Mostrar respuesta de la IA
        aiSubtitle.textContent = aiResponse;
        aiSubtitle.style.opacity = '1';
        aiStatus.textContent = 'Ready';
        
        // Traducir respuesta de la IA
        const aiTranslation = await translateText(aiResponse);
        aiSpanish.textContent = aiTranslation;
        
        // Agregar al contexto
        conversationContext.push({
            role: 'assistant',
            content: aiResponse
        });
        
        // Agregar al historial
        addToHistory(userMessage, userSpanish.textContent, aiResponse, aiTranslation);
        
        // Hablar la respuesta si está activado
        if (enableVoice.checked) {
            speakText(aiResponse);
        }
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        const fallbackResponse = generateSimpleResponse(userMessage);
        aiSubtitle.textContent = fallbackResponse;
        aiStatus.textContent = 'Ready';
        
        const aiTranslation = await translateText(fallbackResponse);
        aiSpanish.textContent = aiTranslation;
        
        conversationContext.push({
            role: 'assistant',
            content: fallbackResponse
        });
        
        addToHistory(userMessage, userSpanish.textContent, fallbackResponse, aiTranslation);
        
        if (enableVoice.checked) {
            speakText(fallbackResponse);
        }
    }
}

// Generar respuesta simple cuando la API no está disponible
function generateSimpleResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
        'hello': ['Hello! How are you today?', 'Hi there! Nice to meet you!', 'Hey! How can I help you practice English?'],
        'hi': ['Hi! How are you?', 'Hello! What would you like to talk about?', 'Hey! Great to chat with you!'],
        'how are you': ['I\'m doing great, thanks! How about you?', 'I\'m good! How are you feeling today?', 'I\'m fine, thank you! What about you?'],
        'bye': ['Goodbye! Keep practicing!', 'See you later! You did great!', 'Bye! Come back soon!'],
        'thank': ['You\'re welcome!', 'No problem at all!', 'Happy to help!'],
        'name': ['I\'m your AI English practice assistant!', 'You can call me AI Assistant!', 'I\'m here to help you practice English!'],
        'help': ['I\'m here to practice English with you. Just speak naturally!', 'Tell me about your day, ask questions, or practice conversations!', 'Let\'s chat! What would you like to talk about?']
    };
    
    for (const [key, possibleResponses] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
        }
    }
    
    const defaultResponses = [
        'That\'s interesting! Can you tell me more?',
        'I see! What else would you like to talk about?',
        'Great! How do you feel about that?',
        'That sounds nice! Can you explain more?',
        'Interesting! What do you think about it?',
        'Cool! Tell me more about your thoughts.',
        'I understand! What happened next?',
        'That\'s good! Do you enjoy it?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Traducir texto usando el backend
async function translateText(text) {
    try {
        console.log('Calling backend /api/translate', { url: `${API_BASE_URL}/api/translate`, text });
        const response = await fetchWithTimeout(`${API_BASE_URL}/api/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                from: 'en',
                to: 'es'
            })
        });
        
        if (!response.ok) {
            throw new Error('Translation API error');
        }
        
        const data = await response.json();
        console.log('Translation result:', data);
        return data.translation || data.responseData?.translatedText || text;
        
    } catch (error) {
        console.error('Error al traducir:', error);
        return '[Traducción no disponible]';
    }
}

// Hablar texto usando Text-to-Speech
function speakText(text) {
    if (!synthesis) return;
    
    // Cancelar cualquier speech en progreso
    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = parseFloat(voiceSpeed.value);
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Intentar usar una voz en inglés
    const voices = synthesis.getVoices();
    const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en-'));
    
    if (englishVoice) {
        utterance.voice = englishVoice;
    }
    
    utterance.onstart = () => {
        aiStatus.textContent = 'Speaking...';
    };
    
    utterance.onend = () => {
        aiStatus.textContent = 'Ready';
    };
    
    synthesis.speak(utterance);
}

// Agregar al historial
function addToHistory(userEnglish, userSpanish, aiEnglish, aiSpanish) {
    const timestamp = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    conversationHistory.push({
        timestamp: timestamp,
        userEnglish: userEnglish,
        userSpanish: userSpanish,
        aiEnglish: aiEnglish,
        aiSpanish: aiSpanish
    });
    
    updateHistoryDisplay();
}

// Actualizar visualización del historial
function updateHistoryDisplay() {
    historyContainer.innerHTML = '';
    
    // Mostrar los últimos 10 elementos en orden inverso
    const recentHistory = conversationHistory.slice(-5).reverse();
    
    recentHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="timestamp">${item.timestamp}</div>
            <div class="text" style="color: #3b82f6; font-weight: 500;">
                🗣️ You: ${item.userEnglish}
            </div>
            <div class="text spanish-text" style="margin-bottom: 10px;">
                🇪🇸 ${item.userSpanish}
            </div>
            <div class="text" style="color: #10b981; font-weight: 500;">
                🤖 AI: ${item.aiEnglish}
            </div>
            <div class="text spanish-text">
                🇪🇸 ${item.aiSpanish}
            </div>
        `;
        historyContainer.appendChild(historyItem);
    });
    
    // Auto-scroll al último elemento
    historyContainer.scrollTop = 0;
}

// Actualizar estado
function updateStatus(text, state) {
    statusText.textContent = text;
    const dot = statusIndicator.querySelector('.status-dot');
    dot.className = 'status-dot';
    
    if (state === 'listening') {
        dot.classList.add('listening');
    } else if (state === 'active') {
        dot.classList.add('active');
    }
}

// Iniciar escucha
async function startListening() {
    console.log('startListening invoked');
    if (isListening || starting) {
        console.log('startListening: already listening or starting, ignoring');
        return;
    }
    starting = true;
    startBtn.disabled = true;
    if (!recognition) {
        console.log('No recognition instance, initializing...');
        if (!initSpeechRecognition()) {
            starting = false;
            startBtn.disabled = false;
            return;
        }
    }
    try {
        // Request microphone permission explicitly
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (permError) {
                console.error('Microphone permission denied:', permError);
                alert('No se pudo acceder al micrófono. Por favor permite el acceso y prueba de nuevo.');
                updateStatus('Microphone permission denied', 'error');
                return;
            }
        }

        recognition.start();
        userSubtitle.textContent = 'Listening... Start speaking in English';
        userSpanish.textContent = 'Escuchando... Comienza a hablar en inglés';
    } catch (error) {
        console.error('Error al iniciar reconocimiento:', error);
        updateStatus('Error starting', 'error');
        alert('Error iniciando reconocimiento de voz: ' + (error.message || error));
        starting = false;
        startBtn.disabled = false;
    }
}

// Detener escucha
function stopListening() {
    isListening = false;
    if (recognition) {
        recognition.stop();
    }
    if (synthesis) {
        synthesis.cancel();
    }
    userSubtitle.textContent = 'Stopped. Click "Start Conversation" to continue.';
    userSpanish.textContent = 'Detenido. Haz click en "Iniciar Conversación" para continuar.';
    aiStatus.textContent = 'Paused';
}

// Limpiar historial
function clearHistory() {
    conversationHistory = [];
    conversationContext = [];
    historyContainer.innerHTML = '<p style="text-align: center; color: #999;">No conversation yet</p>';
    userSubtitle.textContent = 'History cleared. Ready to start!';
    userSpanish.textContent = 'Historial borrado. ¡Listo para comenzar!';
    aiSubtitle.textContent = 'Let\'s start a fresh conversation!';
    aiSpanish.textContent = '¡Empecemos una conversación nueva!';
}

// Event listeners
startBtn.addEventListener('click', (e) => {
    console.log('startBtn clicked');
    startListening();
});
stopBtn.addEventListener('click', stopListening);
clearBtn.addEventListener('click', clearHistory);

// Control de velocidad de voz
voiceSpeed.addEventListener('input', (e) => {
    speedValue.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
});

// Cargar voces
if (synthesis) {
    synthesis.onvoiceschanged = () => {
        synthesis.getVoices();
    };
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, app initializing');
    updateStatus('Ready', 'inactive');
    historyContainer.innerHTML = '<p style="text-align: center; color: #999;">No conversation yet</p>';
    
    // Verificar soporte del navegador
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        userSubtitle.textContent = 'Browser not supported';
        userSpanish.textContent = 'Navegador no compatible. Usa Chrome, Edge o Safari.';
        startBtn.disabled = true;
        updateStatus('Not supported', 'error');
    }
    
    // Cargar voces para TTS
    if (synthesis) {
        synthesis.getVoices();
    }
});

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        if (!isListening) {
            startListening();
        } else {
            stopListening();
        }
    }
});
