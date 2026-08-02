import React, { useState, useRef, useEffect } from 'react';
import { useSensorStore } from '../../store/useSensorStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { askGroqChatbot } from '../../services/groq';
import { Send, Sparkles, User, X, Bot, RefreshCw, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Smart Kitchen Safety Assistant with access to live metrics, PIR motion sensors, and complete past telemetry logs. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { metrics, history, alerts } = useSensorStore();
  const { groqApiKey } = useSettingsStore();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const userMsgText = textToSend || input;
    if (!userMsgText.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: userMsgText }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const res = await askGroqChatbot(newMessages, metrics, groqApiKey, history, alerts);
    if (res.reply) {
      setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    }
    setIsLoading(false);
  };

  const quickPrompts = [
    'Show recent sensor logs',
    'What was peak gas level?',
    'Is the kitchen safe now?',
    'What is the PIR Motion status?',
    'List critical alerts',
  ];

  return (
    <>
      {/* Floating Chatbot Launch Trigger Button (Responsive Compact on Mobile) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-3.5 py-3 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xl shadow-emerald-600/30 border border-emerald-400 transition-all"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse shrink-0" />
        <span className="text-xs sm:text-sm font-sans hidden xs:inline">AI Telemetry Assistant</span>
        <span className="text-xs font-sans xs:hidden">AI Assistant</span>
        <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono badge-yellow">
          GROQ
        </span>
      </motion.button>

      {/* Floating Chatbot Mobile Drawer & Desktop Card */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-x-2 bottom-2 top-14 sm:top-auto sm:bottom-24 sm:right-6 sm:left-auto z-50 w-auto sm:w-[440px] h-auto sm:h-[560px] max-h-[85vh] bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 sm:p-4 bg-emerald-700 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-800/80 border border-emerald-500/40 text-yellow-300">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-extrabold tracking-wide">AURA-GUARD AI</h3>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono badge-yellow">
                        LLM
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-emerald-100 font-medium">
                      Live Telemetry & Safety Assistant
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-emerald-600 text-white transition-colors"
                  aria-label="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Live & Historical Context Strip */}
              <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-4 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-amber-900 shrink-0 overflow-x-auto">
                <span className="shrink-0">
                  Logs: <strong className="text-amber-950 font-bold">{history.length}</strong>
                </span>
                <span className="shrink-0">
                  PIR: <strong className="text-amber-950 font-bold">{metrics.pirMotion === 1 ? 'Occupant' : 'Clear'}</strong>
                </span>
                <span className="shrink-0">
                  MQ2: <strong className="text-amber-950 font-bold">{metrics.mq2} PPM</strong>
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-50">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow">
                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-md font-medium'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm font-normal'
                      }`}
                    >
                      {m.content}
                    </div>

                    {m.role === 'user' && (
                      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Analyzing live telemetry logs...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="p-2 bg-white border-t border-slate-200 flex gap-1.5 overflow-x-auto shrink-0">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 whitespace-nowrap transition-all shrink-0"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Ask about logs, PIR motion, gas levels..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 sm:p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all shadow shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

