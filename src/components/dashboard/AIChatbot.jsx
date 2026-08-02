import React, { useState, useRef, useEffect } from 'react';
import { useSensorStore } from '../../store/useSensorStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { askGroqChatbot } from '../../services/groq';
import { Send, Sparkles, User, X, Bot, RefreshCw } from 'lucide-react';
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
    'Show me recent sensor logs',
    'What was the peak gas level recorded?',
    'Is the kitchen safe right now?',
    'What is the PIR Motion status?',
    'List recent critical alerts',
  ];

  return (
    <>
      {/* Floating Chatbot Launch Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl shadow-emerald-600/30 border border-emerald-400 transition-all"
      >
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        <span className="text-sm font-sans">AI Telemetry & Logs Assistant</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono badge-yellow">
          GROQ
        </span>
      </motion.button>

      {/* Floating Chatbot Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[440px] h-[560px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-800/80 border border-emerald-500/40 text-yellow-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold tracking-wide">AURA-GUARD AI ASSISTANT</h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono badge-yellow">
                      LIVE LOGS
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 font-medium">
                    Live Telemetry & Historical Database Expert
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-emerald-600 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live & Historical Context Strip */}
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-amber-900">
              <span>
                Logged Points: <strong className="text-amber-950 font-bold">{history.length}</strong>
              </span>
              <span>
                PIR: <strong className="text-amber-950 font-bold">{metrics.pirMotion === 1 ? 'Occupant' : 'Clear'}</strong>
              </span>
              <span>
                MQ2: <strong className="text-amber-950 font-bold">{metrics.mq2} PPM</strong>
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-md font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm font-normal'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.role === 'user' && (
                    <div className="h-7 w-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 p-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Groq AI is analyzing live & historical telemetry logs...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex gap-2 overflow-x-auto">
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
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about logs, past trends, PIR motion, gas..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
