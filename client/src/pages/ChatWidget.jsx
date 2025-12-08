import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Send, Loader2, BotIcon,
  Mic, MicOff, Volume2, StopCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
];

const SPEECH_LOCALES = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'ta': 'ta-IN',
  'gu': 'gu-IN'
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // ------------------ SAFETY: CLEANUP ON UNMOUNT ------------------
  // This ensures audio stops if you navigate to a different page 
  // or if the component is destroyed.
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  // ----------------------------------------------------------------

  // ------------------ HELPER: TEXT TO SPEECH ------------------
  const cleanTextForSpeech = (text) => {
    return text.replace(/[*#_`]/g, '').trim();
  };

  const speakText = (text, msgId) => {
    if (!selectedLanguage) return;

    // Stop any currently playing audio first
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);

    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = SPEECH_LOCALES[selectedLanguage] || 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeakingMessageId(msgId);
    // When audio finishes naturally
    utterance.onend = () => setSpeakingMessageId(null);
    // When audio is interrupted/cancelled
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
  };
  // -----------------------------------------------------------

  const initializeChat = (langCode) => {
    const greetings = {
      'en': "Welcome to SUJHAA — Ask anything about PM-AJAY.",
      'hi': "SUJHAA में स्वागत है — PM-AJAY से जुड़ा कोई भी सवाल पूछें।",
      'ta': "SUJHAA வரவேற்கிறது — PM-AJAY பற்றிய கேள்விகளை கேளுங்கள்.",
      'gu': "SUJHAA માં સ્વાગત — PM-AJAY વિશે પૂછો."
    };

    const initialMsg = { id: 1, text: greetings[langCode], sender: 'bot' };
    setMessages([initialMsg]);

    // Only speak welcome message if the widget is actually open
    if (isOpen) {
      setTimeout(() => speakText(initialMsg.text, initialMsg.id), 500);
    }
  };

  useEffect(() => {
    if (selectedLanguage) {
      initializeChat(selectedLanguage);
    }
    scrollToBottom();
  }, [selectedLanguage]); // Removed isOpen here to prevent re-init loops

  // ------------------ EFFECT: AUTO SPEAK ------------------
  useEffect(() => {
    scrollToBottom();

    // CRITICAL FIX: Do NOT start speaking if the widget is closed.
    if (!isOpen) {
      stopSpeaking();
      return;
    }

    const lastMsg = messages[messages.length - 1];

    // Only speak if it's a NEW message (messages length > 1) and from the bot
    if (lastMsg && lastMsg.sender === 'bot' && messages.length > 1) {
      speakText(lastMsg.text, lastMsg.id);
    }
  }, [messages, isOpen]); // Add isOpen dependency to check visibility
  // --------------------------------------------------------

  // Cleanup when closing the modal specifically
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLanguageSelect = (langCode) => setSelectedLanguage(langCode);

  // ------------------ VOICE INPUT ------------------
  const handleVoiceInput = () => {
    stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LOCALES[selectedLanguage] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    stopSpeaking();

    if (!inputValue.trim() || isLoading || !selectedLanguage) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userText = inputValue.trim();
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch("https://backend-ru1r.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          target_language: selectedLanguage,
          chat_history: chatHistory
        })
      });

      const data = await response.json();

      const botMsg = {
        id: Date.now() + 1,
        text: data.text || "Sorry, I couldn't get a response.",
        sender: "bot",
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, something went wrong.",
        sender: "bot"
      }]);
    }

    setIsLoading(false);
  };

  const renderLanguageSelection = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <BotIcon size={48} className="text-orange-500 mb-4" />
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
        Please select your preferred language:
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {LANGUAGE_OPTIONS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className="bg-white border border-orange-400 text-gray-700 hover:bg-orange-500 hover:text-white p-4 rounded-lg text-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );

  const renderChatInterface = () => (
    <>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
              <span className="text-xs text-gray-400 mb-1 px-1">
                {msg.sender === "user" ? "You" : "AAROH"}
              </span>

              <div
                className={`px-5 py-3 text-base rounded-2xl shadow-md ${msg.sender === "user"
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
              >
                <ReactMarkdown
                  components={{
                    ul: (props) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                    ol: (props) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                    strong: (props) => <span className="font-bold" {...props} />,
                    p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>

                {/* ------------------ AUDIO BUTTON ------------------ */}
                {msg.sender === 'bot' && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-start">
                    <button
                      onClick={() => {
                        if (speakingMessageId === msg.id) {
                          stopSpeaking();
                        } else {
                          speakText(msg.text, msg.id);
                        }
                      }}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-all ${speakingMessageId === msg.id
                        ? "bg-orange-100 text-orange-600 animate-pulse"
                        : "bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                        }`}
                      title="Read aloud"
                    >
                      {speakingMessageId === msg.id ? (
                        <>
                          <StopCircle size={14} /> Stop
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} /> Listen
                        </>
                      )}
                    </button>
                  </div>
                )}
                {/* -------------------------------------------------- */}

              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm">
              <Loader2 className="animate-spin w-6 h-6 text-orange-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto w-full items-center">

          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your message here..."}
              className={`w-full border rounded-xl pl-4 pr-12 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${isListening ? "border-orange-500 bg-orange-50" : "border-gray-300"
                }`}
            />

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${isListening
                ? "bg-red-500 text-white animate-pulse"
                : "text-gray-400 hover:text-orange-500 hover:bg-gray-100"
                }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all flex items-center justify-center font-medium"
          >
            <Send size={20} />
          </button>

        </form>
      </div>
    </>
  );

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-all hover:scale-105"
        >
          <BotIcon size={28} />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <BotIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AAROH</h3>
                  <p className="text-sm text-orange-100">AI Assistant For PM-AJAY</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedLanguage && (
                  <button
                    onClick={() => {
                      setSelectedLanguage(null);
                      stopSpeaking();
                    }}
                    className="text-sm border border-white/50 p-1 px-3 rounded-full hover:bg-white/20"
                  >
                    Change Language
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-orange-600 p-2 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {!selectedLanguage ? renderLanguageSelection() : renderChatInterface()}

          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;