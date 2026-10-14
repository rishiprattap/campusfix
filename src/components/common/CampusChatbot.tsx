import React, { useState, useRef, useEffect } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { askCampusAssistant } from '../../services/aiAssistant';
import { MessageSquare, X, Send, Bot, User, Sparkles, Minimize2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const CampusChatbot: React.FC = () => {
  const { complaints } = useComplaints();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am CampusFix AI, your campus assistance bot. You can ask me to check complaint status, report procedures, campus facility hotlines, or maintenance schedules.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askCampusAssistant(
        textToSend,
        complaints,
        user?.role || 'student'
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I ran into a temporary hiccup retrieving that campus information. Please try again or contact Campus Dispatch at ext. 3333.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Check status of CF-2026-101',
    'How do I report broken Wi-Fi?',
    'Emergency facilities hotline',
    'What are Library hours?'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-full shadow-lg transition-all transform hover:scale-105 group"
          aria-label="Open CampusFix AI Assistant"
        >
          <Bot className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-semibold tracking-wide">CampusFix AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      ) : (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-4 py-3 bg-[#166534] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">CampusFix AI Assistant</div>
                <div className="text-[11px] text-emerald-200">24/7 Operations & Complaints Help</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded hover:bg-emerald-700/50 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50 text-xs">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-lg whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#166534] text-white rounded-br-none'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      m.sender === 'user' ? 'text-emerald-200 text-right' : 'text-stone-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-stone-500">
                <div className="w-6 h-6 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3 py-2 bg-white border border-stone-200 rounded-lg shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse delay-300" />
                  <span className="text-[11px] text-stone-400 ml-1">Searching campus records...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-stone-100 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 rounded-full hover:bg-stone-50 hover:text-stone-900 whitespace-nowrap transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about campus complaints..."
              className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-[#166534] hover:bg-[#14532d] disabled:opacity-40 text-white rounded-lg transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
