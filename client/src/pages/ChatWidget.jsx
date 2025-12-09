import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Send, Loader2, Bot, // Changed BotIcon to Bot for better compatibility
  Mic, MicOff, Volume2, StopCircle,
  ArrowLeft, HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Configuration Constants ---
const LOGIN_PAGE_URL = "https://sujhaa-frontend.vercel.app/login";
const REGISTRATION_PAGE_URL = "https://sujhaa-frontend.vercel.app/register";

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
];

const SPEECH_LOCALES = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'ta': 'ta-IN',
  'gu': 'gu-IN'
};

// --- DATA: Multilingual Templates ---
// This object holds the text for buttons in every language
const CHAT_TEMPLATES = {
  'en': {
    main: [
      { label: "How to Apply on SUJHAA", query: "How to apply for scheme on SUJHAA" },
      { label: "Documents Required", query: "What documents are required to apply on SUJHAA" },
      { label: "Track My Application", query: "How to track my application on SUJHAA" },
    ],

  },
  'hi': {
    main: [
      { label: "SUJHAA पर योजना के लिए आवेदन कैसे करें?", query: "How to apply for scheme on SUJHAA" },
      { label: "आवेदन के लिए आवश्यक दस्तावेज़", query: "What documents are required to apply on SUJHAA" },
      { label: "मेरे आवेदन की स्थिति (Status) देखें", query: "How to track my application on SUJHAA" },
    ],

  },
  'ta': {
    main: [
      { label: "SUJHAA இல் விண்ணப்பிப்பது எப்படி?", query: "How to apply for scheme on SUJHAA" },
      { label: "தேவையான ஆவணங்கள் என்ன?", query: "What documents are required to apply on SUJHAA" },
      { label: "எனது விண்ணப்பத்தை எவ்வாறு கண்காணிப்பது?", query: "How to track my application on SUJHAA" },
    ],

  },
  'gu': {
    main: [
      { label: "SUJHAA પર યોજના માટે કેવી રીતે અરજી કરવી?", query: "How to apply for scheme on SUJHAA" },
      { label: "જરૂરી દસ્તાવેજો કયા છે?", query: "What documents are required to apply on SUJHAA" },
      { label: "મારી અરજીનું સ્ટેટસ કેવી રીતે તપાસવું?", query: "How to track my application on SUJHAA" },
    ],
  }
};

// --- Custom Link Renderer (Prevents hydration errors and handles clicks) ---
const CustomLink = ({ href, children }) => {
  let finalHref = href || "#";

  // Safety check for children to avoid crashes
  const childText = React.Children.toArray(children)
    .map(child => {
      if (typeof child === 'string') return child;
      if (child?.props?.children) {
        return Array.isArray(child.props.children)
          ? child.props.children.join('')
          : String(child.props.children);
      }
      return '';
    })
    .join('')
    .toLowerCase();

  if (childText.includes('login') && LOGIN_PAGE_URL) {
    finalHref = LOGIN_PAGE_URL;
  } else if ((childText.includes('registration') || childText.includes('register')) && REGISTRATION_PAGE_URL) {
    finalHref = REGISTRATION_PAGE_URL;
  }

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline font-semibold hover:text-blue-800 transition-colors break-all cursor-pointer z-10 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [menuView, setMenuView] = useState('main');
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Safety cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // --- Helper: Text to Speech ---
  const cleanTextForSpeech = (text) => {
    if (!text) return "";
    return text.replace(/[*#_`\[\]()]/g, '').replace(/https?:\/\/\S+/g, 'link').trim();
  };

  const speakText = (text, msgId) => {
    if (!selectedLanguage || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = SPEECH_LOCALES[selectedLanguage] || 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeakingMessageId(msgId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
  };

  const initializeChat = (langCode) => {
    const greetings = {
      'en': "Welcome to SUJHAA — Ask anything about PM-AJAY.",
      'hi': "SUJHAA में आपका स्वागत है — PM-AJAY योजना से जुड़ा कोई भी सवाल पूछें।",
      'ta': "SUJHAA வரவேற்கிறது — PM-AJAY பற்றிய கேள்விகளை கேளுங்கள்.",
      'gu': "SUJHAA માં સ્વાગત છે — PM-AJAY વિશે ગમે તે પૂછો."
    };

    const initialMsg = { id: 1, text: greetings[langCode] || greetings['en'], sender: 'bot' };
    setMessages([initialMsg]);
    setMenuView('main');
  };

  // Trigger initialization when language changes
  useEffect(() => {
    if (selectedLanguage) {
      initializeChat(selectedLanguage);
    }
    // Force scroll to bottom on next tick
    setTimeout(scrollToBottom, 100);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
  };

  // --- Voice Input ---
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

  // --- API & Option Handlers ---
  const fetchBotResponse = async (userText) => {
    setIsLoading(true);
    try {
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      chatHistory.push({ role: 'user', content: userText });

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
      console.error("Bot Fetch Error:", err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, something went wrong. Please check your connection.",
        sender: "bot"
      }]);
    }
    setIsLoading(false);
  };

  const handleOptionClick = async (option) => {
    stopSpeaking();
    if (isLoading || !selectedLanguage) return;

    if (option.action === 'OPEN_SUPPORT') {
      setMenuView('support');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // 1. Show the user message in the UI (Using the translated label)
    const userMsg = { id: Date.now(), text: option.label, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    // 2. Reset menu to main for next time
    setMenuView('main');

    // 3. Send the query to backend
    await fetchBotResponse(option.query);
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
    setMenuView('main');

    await fetchBotResponse(userText);
  };

  // --- Renderers ---
  const renderLanguageSelection = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <Bot size={48} className="text-orange-500 mb-4" />
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

  const renderChatInterface = () => {
    // Fallback to 'en' if the selected language keys are missing
    const currentOptions = CHAT_TEMPLATES[selectedLanguage] || CHAT_TEMPLATES['en'];
    // Ensure optionsToShow is always an array
    const optionsToShow = currentOptions[menuView] || [];

    // Determine "Back" button text based on language
    let backText = 'Back to Main Menu';
    if (selectedLanguage === 'hi') backText = 'मुख्य मेनू पर वापस जाएं';
    else if (selectedLanguage === 'ta') backText = 'முதன்மை மெனுவுக்குத் திரும்பு';
    else if (selectedLanguage === 'gu') backText = 'મુખ્ય મેનુ પર પાછા જાઓ';

    return (
      <>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">

          {/* --- DYNAMIC OPTIONS MENU --- */}
          {/* Only show if message exists and last message was from bot */}
          {messages.length > 0 && messages[messages.length - 1].sender === "bot" && !isLoading && (
            <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {menuView === 'support' && (
                <div className="flex items-center gap-2 mb-3 text-orange-600 font-semibold cursor-pointer hover:underline" onClick={() => setMenuView('main')}>
                  <ArrowLeft size={16} />
                  <span>{backText}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionsToShow.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt)}
                    className={`bg-white border border-orange-400 text-gray-700 hover:bg-orange-500 hover:text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg text-left flex items-center justify-between group
                                            ${opt.action === 'OPEN_SUPPORT' ? 'bg-orange-50 border-orange-500' : ''}`}
                  >
                    <span>{opt.label}</span>
                    {opt.action === 'OPEN_SUPPORT' && <HelpCircle size={16} className="text-orange-500 group-hover:text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGE HISTORY */}
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
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: (props) => <ul className="list-disc ml-4 space-y-1 text-left" {...props} />,
                      ol: (props) => <ol className="list-decimal ml-4 space-y-1 text-left" {...props} />,
                      strong: (props) => <span className="font-bold text-left" {...props} />,
                      p: (props) => <p className="mb-2 last:mb-0 text-left leading-relaxed break-words" {...props} />,
                      a: CustomLink,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>

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
                          <> <StopCircle size={14} /> Stop </>
                        ) : (
                          <> <Volume2 size={14} /> Listen </>
                        )}
                      </button>
                    </div>
                  )}
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
  };

  return (
    <>
      {/* --- Launcher Button --- */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Open Chat"
        >
          <Bot size={28} />
        </button>
      )}

      {/* --- Chat Modal --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Main Container */}
          <div className="relative bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="bg-orange-500 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={24} />
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
                    className="text-sm border border-white/50 p-1 px-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    Change Language
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-orange-600 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {!selectedLanguage ? renderLanguageSelection() : renderChatInterface()}

          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;