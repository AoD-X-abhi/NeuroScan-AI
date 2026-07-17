import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { Send, Brain, User, Sparkles, MessageSquare, Plus, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
}

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => `conv_${Date.now()}`);
  const [conversations, setConversations] = useState<{ id: string; title: string }[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    "What is Glioma?",
    "What causes Alzheimer's?",
    "Explain spinal stenosis on MRI.",
    "What does Grad-CAM represent?"
  ];

  const fetchMessages = async (convId: string) => {
    try {
      const data = await apiFetch<ChatMessage[]>(`/api/chat/messages/${convId}`);
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages(conversationId);
  }, [conversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;
    setIsSending(true);
    setInputVal('');

    // Add user message locally for immediate UI update
    const userMsgLocal: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsgLocal]);

    try {
      const res = await apiFetch<{ response: string; sender: string; timestamp: string }>('/api/chat', {
        method: 'POST',
        json: {
          message: textToSend,
          conversation_id: conversationId
        }
      });

      const botMsgLocal: ChatMessage = {
        id: Date.now() + 1,
        sender: res.sender,
        message: res.response,
        timestamp: res.timestamp
      };
      setMessages((prev) => [...prev, botMsgLocal]);

      // Update conversations sidebar list if this is the first message
      if (messages.length === 0) {
        const title = textToSend.length > 22 ? textToSend.substring(0, 22) + "..." : textToSend;
        setConversations((prev) => [{ id: conversationId, title }, ...prev]);
      }
      
    } catch (e: any) {
      const errorMsgLocal: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        message: "Error: Unable to reach AI services. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsgLocal]);
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    setConversationId(`conv_${Date.now()}`);
    setMessages([]);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl animate-fade-in">
      {/* Chats Sidebar */}
      <div className="w-64 border-r border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 p-4 flex flex-col justify-between hidden md:flex">
        <div className="space-y-4">
          <button 
            onClick={handleNewChat}
            className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </button>

          <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-2">Recent Chats</h4>
            {conversations.length === 0 ? (
              <span className="text-[10px] text-brand-slate dark:text-slate-500 px-2.5">No recent consults</span>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setConversationId(c.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold truncate transition-all flex items-center space-x-2 ${
                    c.id === conversationId 
                      ? 'bg-brand-blue/10 text-brand-blue' 
                      : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-white/10 dark:bg-slate-900/10">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            /* Welcome State */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8">
              <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white shadow-xl shadow-brand-blue/20 animate-bounce">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2">NeuroScan AI Assistant</h3>
                <p className="text-brand-slate dark:text-slate-400 text-xs leading-relaxed">
                  Welcome to your specialized clinical consult. I can assist with MRI queries, tumors, Alzheimer's stages, and spinal stenosis.
                </p>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {presets.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 hover:bg-brand-blue/5 hover:border-brand-blue text-left text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between group shadow-premium"
                  >
                    <span>{q}</span>
                    <Sparkles className="w-3.5 h-3.5 text-brand-cyan opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Feed */
            <div className="space-y-6">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex items-start space-x-3.5 ${isUser ? 'justify-end' : ''}`}>
                    {!isUser && (
                      <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white flex items-center justify-center shadow-md">
                        <Brain className="w-4.5 h-4.5" />
                      </div>
                    )}
                    <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed shadow-premium ${
                      isUser 
                        ? 'bg-brand-blue text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-brand-navy dark:text-slate-200 rounded-tl-none'
                    }`}>
                      <p>{m.message}</p>
                      <span className={`block text-[9px] mt-1.5 text-right ${isUser ? 'text-white/60' : 'text-brand-slate'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {isUser && (
                      <div className="w-8.5 h-8.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                        <User className="w-4.5 h-4.5" />
                      </div>
                    )}
                  </div>
                );
              })}
              {isSending && (
                <div className="flex items-start space-x-3.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white flex items-center justify-center shadow-md">
                    <Brain className="w-4.5 h-4.5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs shadow-premium flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />
                    <span className="text-brand-slate">Assistant is typing...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }} 
            className="flex items-center space-x-3"
          >
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a medical MRI/imaging question..."
              className="flex-1 px-4.5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-xs transition-all"
            />
            <button 
              type="submit"
              disabled={isSending || !inputVal.trim()}
              className="p-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue/95 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white shadow-lg transition-all"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
