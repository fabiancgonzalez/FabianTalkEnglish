// Variables globales
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;
let starting = false;
let stopRequested = false; // si el usuario detuvo manualmente la escucha
let ttsPlaying = false; // true cuando el TTS está hablando
let suppressAutoRestart = false; // evita reinicios automáticos durante TTS
let restartAttempts = 0;
let lastRestartTime = 0;
const MAX_RESTARTS = 6;
const RESTART_WINDOW_MS = 60_000; // ventana para contar reintentos
const RESTART_DELAY_MS = 500; // demora antes de reintentar (ms)

// In-memory event log visible on device for debugging
let eventLog = [];
const MAX_LOG_ENTRIES = 200;
function pushLog(msg) {
    try {
        const ts = new Date().toISOString();
        const entry = `${ts} ${msg}`;
        console.log(entry);
        eventLog.push(entry);
        if (eventLog.length > MAX_LOG_ENTRIES) eventLog.shift();
        // Keep the compact debug badge updated with last message
        const dbg = document.getElementById('debugPanel');
        if (dbg) {
            const compact = dbg.dataset.compact === 'true';
            const badge = dbg.querySelector('.debug-badge');
            if (badge) badge.textContent = entry.split(' ')[1] + ' ' + entry.split(' ')[2] || entry;
            const content = dbg.querySelector('.log-content');
            if (content && !compact) content.textContent = eventLog.slice(-100).join('\n');
        }
    } catch (e) {
        console.debug('pushLog error', e);
    }
}

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
        pushLog('recognition.onstart');
        starting = false;
        isListening = true;
        stopRequested = false;
        restartAttempts = 0;
        lastRestartTime = Date.now();
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

    // Eventos adicionales para diagnósticos y reconexión en móviles
    recognition.onspeechstart = () => {
        console.log('Speech started');
        updateStatus('Listening...', 'listening');
    };

    recognition.onspeechend = () => {
        console.log('Speech ended');
        pushLog('recognition.onspeechend');
        // En algunos móviles la sesión puede terminar justo después de hablar; intentar reinicio suave
        setTimeout(() => {
            if (!ttsPlaying && !stopRequested && !suppressAutoRestart) {
                attemptAutoRestart('speechend');
            }
        }, 200);
    };

    recognition.onaudiostart = () => {
        console.log('Audio capture started');
        pushLog('recognition.onaudiostart');
    };

    recognition.onaudioend = () => {
        console.log('Audio capture ended');
        pushLog('recognition.onaudioend');
        // Reintentar si la captura de audio se corta inesperadamente
        setTimeout(() => {
            if (!ttsPlaying && !stopRequested && !suppressAutoRestart && document.visibilityState === 'visible') {
                attemptAutoRestart('audioend');
            }
        }, 300);
    };

    recognition.onnomatch = (event) => {
        console.log('No speech match', event);
        pushLog('recognition.onnomatch');
        // Algunos navegadores envían nomatch antes de cerrar; intentar reconectar
        setTimeout(() => {
            if (!ttsPlaying && !stopRequested && !suppressAutoRestart) {
                attemptAutoRestart('nomatch');
            }
        }, 200);
    };

    recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event);
        pushLog(`recognition.onerror error=${event.error} message=${event.message || ''}`);
        // Manejo específico de errores comunes
        if (event.error === 'no-speech') {
            updateStatus('No speech detected. Keep talking...', 'active');
            // En móviles esto suele terminar la sesión; intentar reinicio seguro
            setTimeout(() => {
                attemptAutoRestart('no-speech');
            }, RESTART_DELAY_MS);
        } else if (event.error === 'network') {
            updateStatus('Network error. Check your connection.', 'error');
            stopListening();
        } else if (event.error === 'aborted') {
            // Abort indica que la captura fue interrumpida; en móviles a veces se aborta por timeout.
            updateStatus('Recognition aborted. Please press Start to retry.', 'error');
            console.warn('Recognition aborted; will attempt auto-restart on mobile');
            starting = false;
            isListening = false;
            startBtn.disabled = false;
            // Intentamos reiniciar si el usuario no pidió parar
            setTimeout(() => {
                attemptAutoRestart('aborted');
            }, RESTART_DELAY_MS);
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
        isListening = false;
        pushLog('recognition.onend');
        if (suppressAutoRestart) {
            console.log('Recognition ended due to TTS or intentional stop; suppressing auto-restart');
            updateStatus('Paused for speech', 'inactive');
            startBtn.disabled = false;
            stopBtn.disabled = true;
            return;
        }
        // En móviles el servicio puede detenerse tras un tiempo; reintentar si no fue una parada explícita
        if (!stopRequested && document.visibilityState === 'visible') {
            console.log('Recognition ended unexpectedly; attempting to auto-restart');
            pushLog('attempting auto-restart after end');
            attemptAutoRestart('ended');
        } else {
            updateStatus('Stopped', 'inactive');
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    };
    
    return true;
}

// Intentar reiniciar el reconocimiento de forma segura (para móviles)
function attemptAutoRestart(reason) {
    if (!recognition) return;
    if (stopRequested) {
        console.log('Auto-restart skipped because stop was requested');
        return;
    }
    if (suppressAutoRestart) {
        console.log('Auto-restart suppressed (TTS or intentional stop)');
        return;
    }
    if (document.visibilityState !== 'visible') {
        console.log('Auto-restart skipped because page is not visible');
        return;
    }
    const now = Date.now();
    if (now - lastRestartTime > RESTART_WINDOW_MS) {
        restartAttempts = 0;
    }
    if (restartAttempts >= MAX_RESTARTS) {
        console.warn('Max restart attempts reached, not restarting');
        updateStatus('Speech recognition unavailable', 'error');
        startBtn.disabled = false;
        stopBtn.disabled = true;
        return;
    }
    restartAttempts++;
    lastRestartTime = now;
    updateStatus('Reconnecting...', 'active');
    setDebug(`restarts: ${restartAttempts}/${MAX_RESTARTS} reason:${reason}`);
    pushLog(`attemptAutoRestart scheduled reason=${reason} attempt=${restartAttempts}`);
    starting = true;
    // Delays ligeramente mayores si hay varios reintentos consecutivos
    const delay = Math.min(RESTART_DELAY_MS * Math.pow(1.4, restartAttempts - 1), 3000);
    setTimeout(() => {
        try {
            recognition.start();
            console.log('Auto-restarted recognition due to:', reason);
            pushLog(`recognition.start called reason=${reason} attempt=${restartAttempts}`);
            setDebug(`restarted: ${restartAttempts}/${MAX_RESTARTS}`);
        } catch (err) {
            console.error('Error restarting recognition:', err);
            pushLog(`recognition.start error: ${err.message || err}`);
            starting = false;
        }
    }, delay);
}

// Mostrar info de debug pequeña (reconexiones, razón)
function setDebug(text) {
    try {
        const panel = document.getElementById('debugPanel');
        if (panel) {
            const badge = panel.querySelector('.debug-badge');
            const content = panel.querySelector('.log-content');
            if (badge) badge.textContent = text;
            if (content && panel.dataset.compact === 'false') {
                content.textContent = eventLog.slice(-200).join('\n');
            }
        } else {
            const el = document.getElementById('debugInfo');
            if (el) el.textContent = text;
            else console.debug('Debug:', text);
        }
    } catch (e) {
        console.debug('Debug write error', e);
    }
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
    
    // Si el reconocimiento está activo, lo detenemos y suprimimos reinicios automáticos durante el TTS
    if (recognition && isListening) {
        suppressAutoRestart = true;
        try {
            recognition.stop();
            console.log('Stopping recognition to play TTS');
        } catch (err) {
            console.warn('Error stopping recognition for TTS', err);
        }
    }
    ttsPlaying = true;

    utterance.onstart = () => {
        aiStatus.textContent = 'Speaking...';
    };
    
    utterance.onend = () => {
        aiStatus.textContent = 'Ready';
        ttsPlaying = false;
        // Permitir reinicios automáticos otra vez y reintentar si corresponde
        suppressAutoRestart = false;
        setTimeout(() => {
            if (!stopRequested) attemptAutoRestart('tts-ended');
        }, RESTART_DELAY_MS);
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

// Utilidad: comprobar permisos y dispositivos de microphone
async function checkMicrophoneAndPermissions() {
    try {
        let permState = 'unknown';
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const p = await navigator.permissions.query({ name: 'microphone' });
                permState = p.state;
                p.onchange = () => {
                    pushLog('permission change: ' + p.state);
                    const panel = document.getElementById('debugPanel');
                    if (panel && panel.updatePermDisplay) panel.updatePermDisplay(p.state);
                };
            } catch (permErr) {
                pushLog('permissions.query error: ' + (permErr.message || permErr));
            }
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasInput = devices.some(d => d.kind === 'audioinput');
        pushLog(`checkMicrophoneAndPermissions mic:${hasInput} perm:${permState}`);
        return { hasInput, permState };
    } catch (err) {
        pushLog('checkMicrophoneAndPermissions error: ' + (err.message || err));
        return { hasInput: false, permState: 'unknown' };
    }
}

// Test de micrófono: obtiene audio y muestra nivel en debugPanel
let _micTestStream = null;
let _micTestCtx = null;
let _micTestAnalyser = null;
let _micTestAnimation = null;
async function testMicrophone() {
    try {
        const perm = await checkMicrophoneAndPermissions();
        if (!perm.hasInput) {
            pushLog('testMicrophone: no audioinput devices');
            alert('No microphone devices found.');
            return false;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        _micTestStream = stream;
        _micTestCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = _micTestCtx.createMediaStreamSource(stream);
        _micTestAnalyser = _micTestCtx.createAnalyser();
        _micTestAnalyser.fftSize = 256;
        src.connect(_micTestAnalyser);
        pushLog('testMicrophone: stream active');

        const panel = document.getElementById('debugPanel');
        const meterFill = panel ? panel.querySelector('.meter-fill') : null;

        function update() {
            if (!_micTestAnalyser) return;
            const data = new Uint8Array(_micTestAnalyser.frequencyBinCount);
            _micTestAnalyser.getByteTimeDomainData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                const v = (data[i] - 128) / 128;
                sum += v * v;
            }
            const rms = Math.sqrt(sum / data.length);
            const pct = Math.min(1, rms * 3);
            if (panel && panel.updateMeter) panel.updateMeter(pct);
            if (eventLog) pushLog(`mic-level ${pct.toFixed(3)}`);
            _micTestAnimation = requestAnimationFrame(update);
        }
        update();
        return true;
    } catch (err) {
        pushLog('testMicrophone error: ' + (err.message || err));
        alert('Error accessing microphone: ' + (err.message || err));
        return false;
    }
}

function stopMicrophoneTest() {
    try {
        if (_micTestAnimation) cancelAnimationFrame(_micTestAnimation);
        _micTestAnimation = null;
        if (_micTestCtx && _micTestCtx.close) _micTestCtx.close();
        _micTestCtx = null;
        if (_micTestStream) {
            _micTestStream.getTracks().forEach(t => t.stop());
        }
        _micTestStream = null;
        _micTestAnalyser = null;
        const panel = document.getElementById('debugPanel');
        if (panel && panel.updateMeter) panel.updateMeter(0);
        pushLog('stopMicrophoneTest');
    } catch (e) {
        pushLog('stopMicrophoneTest error: ' + (e.message || e));
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
    stopRequested = false;
    restartAttempts = 0;
    lastRestartTime = Date.now();
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
        let micAccessPromise = null;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            micAccessPromise = navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    stream.getTracks().forEach((track) => track.stop());
                    return true;
                });
        }

        recognition.start();
        userSubtitle.textContent = 'Listening... Start speaking in English';
        userSpanish.textContent = 'Escuchando... Comienza a hablar en inglés';

        if (micAccessPromise) {
            micAccessPromise
                .catch((permError) => {
                    console.error('Microphone permission denied:', permError);
                    pushLog('getUserMedia denied: ' + (permError.message || permError));
                    alert('No se pudo acceder al micrófono. Por favor permite el acceso y prueba de nuevo.');
                    updateStatus('Microphone permission denied', 'error');
                    stopListening();
                });
        }

        checkMicrophoneAndPermissions().then(({ hasInput, permState }) => {
            if (!hasInput) {
                pushLog('startListening: no mic devices found');
                updateStatus('No microphone', 'error');
                alert('No microphone found on this device. Please check hardware and browser permissions.');
                stopListening();
                return;
            }
            const panel = document.getElementById('debugPanel');
            if (panel && panel.updatePermDisplay) panel.updatePermDisplay(permState);
        });
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
    stopRequested = true;
    if (recognition) {
        recognition.stop();
    }
    if (synthesis) {
        synthesis.cancel();
    }
    userSubtitle.textContent = 'Stopped. Click "Start Conversation" to continue.';
    userSpanish.textContent = 'Detenido. Haz click en "Iniciar Conversación" para continuar.';
    aiStatus.textContent = 'Paused';
    startBtn.disabled = false;
    stopBtn.disabled = true;
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

function handleStartInteraction(e) {
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }
    console.log('startBtn clicked');
    startListening();
}

// Event listeners
startBtn.addEventListener('pointerup', handleStartInteraction);
startBtn.addEventListener('click', handleStartInteraction);
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

    // Create a visible debug panel for mobile with Test Mic and logs
    if (!document.getElementById('debugPanel')) {
        const panel = document.createElement('div');
        panel.id = 'debugPanel';
        const isMobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || ('ontouchstart' in window);
        panel.dataset.compact = isMobile ? 'false' : 'true';
        panel.style.position = 'fixed';
        panel.style.left = '8px';
        panel.style.bottom = '8px';
        panel.style.width = isMobile ? '92%' : '320px';
        panel.style.maxWidth = 'calc(100% - 16px)';
        panel.style.padding = '8px 10px';
        panel.style.background = 'rgba(0,0,0,0.85)';
        panel.style.color = 'white';
        panel.style.fontSize = '12px';
        panel.style.borderRadius = '10px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.45)';
        panel.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                <div style="font-weight:700;">Debug</div>
                <div style="display:flex; gap:6px; align-items:center;">
                    <span id="dbgPerm" style="font-size:11px;padding:4px 6px;border-radius:6px;background:rgba(255,255,255,0.04)"></span>
                    <button id="dbgToggle" style="background:#111;color:#fff;border:none;padding:6px 8px;border-radius:6px;font-size:12px;">Toggle</button>
                    <button id="dbgTest" style="background:#1166ff;color:#fff;border:none;padding:6px 8px;border-radius:6px;font-size:12px;">Test Mic</button>
                </div>
            </div>
            <div class="debug-badge" style="margin-top:8px;opacity:0.95;font-size:12px;color:#ddd;">--</div>
            <div class="meter" style="height:8px;background:rgba(255,255,255,0.06);border-radius:6px;margin-top:8px;display:none;">
                <div class="meter-fill" style="height:100%;width:0%;background:#0b6;border-radius:6px;"></div>
            </div>
            <pre class="log-content" style="display:block;white-space:pre-wrap;max-height:260px;overflow:auto;margin-top:8px;padding:8px;background:rgba(255,255,255,0.02);border-radius:6px;">${eventLog.slice(-200).join('\n')}</pre>
            <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:8px;">
                <button id="dbgCopy" style="background:#0b6;color:#fff;border:none;padding:6px 8px;border-radius:6px;font-size:12px;">Copy</button>
                <button id="dbgClear" style="background:#a00;color:#fff;border:none;padding:6px 8px;border-radius:6px;font-size:12px;">Clear</button>
            </div>
        `;
        document.body.appendChild(panel);

        const dbgToggleBtn = document.getElementById('dbgToggle');
        const dbgTestBtn = document.getElementById('dbgTest');
        const dbgCopyBtn = document.getElementById('dbgCopy');
        const dbgClearBtn = document.getElementById('dbgClear');
        const dbgPerm = document.getElementById('dbgPerm');
        const logContent = panel.querySelector('.log-content');
        const meter = panel.querySelector('.meter');
        const meterFill = panel.querySelector('.meter-fill');

        function updatePermDisplay(state) {
            dbgPerm.textContent = state ? 'mic:' + state : 'mic:unknown';
            dbgPerm.style.opacity = '0.95';
        }

        dbgToggleBtn.addEventListener('click', () => {
            const p = document.getElementById('debugPanel');
            const content = p.querySelector('.log-content');
            const compact = p.dataset.compact === 'true';
            p.dataset.compact = compact ? 'false' : 'true';
            content.style.display = compact ? 'block' : 'none';
            if (!compact) content.textContent = '';
            else content.textContent = eventLog.slice(-200).join('\n');
        });

        dbgTestBtn.addEventListener('click', async () => {
            if (dbgTestBtn.dataset.running === 'true') {
                stopMicrophoneTest();
                dbgTestBtn.textContent = 'Test Mic';
                dbgTestBtn.dataset.running = 'false';
                meter.style.display = 'none';
            } else {
                const ok = await testMicrophone();
                if (ok) {
                    dbgTestBtn.textContent = 'Stop Test';
                    dbgTestBtn.dataset.running = 'true';
                    meter.style.display = 'block';
                }
            }
        });

        dbgCopyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(eventLog.join('\n'));
                pushLog('Logs copied to clipboard');
            } catch (e) {
                pushLog('Failed to copy logs: ' + (e.message || e));
            }
        });

        dbgClearBtn.addEventListener('click', () => {
            eventLog = [];
            logContent.textContent = '';
            pushLog('Logs cleared');
        });

        // Expose a simple updater to update permission display from other functions
        panel.updatePermDisplay = updatePermDisplay;
        panel.updateMeter = (pct) => {
            meterFill.style.width = (pct * 100).toFixed(1) + '%';
        };
    }

    // Check and show permission state
    checkMicrophoneAndPermissions().then(({hasInput, permState}) => {
        const panel = document.getElementById('debugPanel');
        if (panel && panel.updatePermDisplay) panel.updatePermDisplay(permState);
        if (permState === 'denied') {
            // Show a prominent banner to user with steps
            if (!document.getElementById('micPermissionBanner')) {
                const b = document.createElement('div');
                b.id = 'micPermissionBanner';
                b.style.position = 'fixed';
                b.style.top = '8px';
                b.style.left = '8px';
                b.style.right = '8px';
                b.style.background = '#ffdddd';
                b.style.color = '#700';
                b.style.padding = '10px';
                b.style.border = '1px solid #f5c2c2';
                b.style.zIndex = '9999';
                b.style.borderRadius = '8px';
                b.textContent = 'Microphone access is blocked for this site. Please enable microphone in site settings (Chrome: Site settings → Microphone).';
                document.body.appendChild(b);
            }
        }
    });
});

// Manejar cuando la página vuelve a ser visible: intentar reconectar si es necesario
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !isListening && !stopRequested && !suppressAutoRestart) {
        console.log('Page visible: attempting to restart recognition');
        attemptAutoRestart('visibilitychange');
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
