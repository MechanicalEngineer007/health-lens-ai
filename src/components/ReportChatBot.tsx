import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw, HelpCircle, ArrowRight, WifiOff } from 'lucide-react';
import { AnalysisReport, ChatMessage } from '../types/report.ts';
import { askHealthAssistant } from '../services/geminiService.ts';

interface ReportChatBotProps {
  report: AnalysisReport;
  isOfflineMode?: boolean;
}

export const ReportChatBot: React.FC<ReportChatBotProps> = ({ report, isOfflineMode = true }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I have reviewed your blood report. Your **Vitamin D level is 6.81 ng/mL** (severe deficiency) and **LDL is 135 mg/dL** (borderline elevated), while your liver, kidneys, and blood sugar are in great shape. 

What questions do you have about your results, foods, or remedies?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        'How should I take Vitamin D3 for best absorption?',
        'What foods should I eat to lower my LDL cholesterol?',
        'Are my kidneys and liver completely normal?',
        'What exercise routine works best for my profile?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const reply = await askHealthAssistant(query, report, history, isOfflineMode);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-teal-800 to-emerald-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-200">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-['Outfit'] flex items-center gap-1.5">
              HealthLens AI Clinical Assistant
              {isOfflineMode ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-emerald-700/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <WifiOff className="w-2.5 h-2.5" /> Offline
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </h3>
            <p className="text-[11px] text-teal-100/80">Context-aware health Q&A based on your report</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-teal-700 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px]">
                {msg.role === 'user' ? (
                  <>
                    <User className="w-3 h-3" /> You • {msg.timestamp}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-teal-600" /> HealthLens AI • {msg.timestamp}
                  </>
                )}
              </div>
              <div className="whitespace-pre-line leading-relaxed">
                {msg.content}
              </div>

              {/* Suggested Questions */}
              {msg.suggestedQuestions && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Suggested Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((sq, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(sq)}
                        className="text-[11px] text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/70 rounded-lg px-2.5 py-1 text-left transition-all flex items-center gap-1"
                      >
                        <span>{sq}</span>
                        <ArrowRight className="w-3 h-3 shrink-0 text-teal-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
            <span className="text-xs font-medium">Analyzing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about foods, supplements, ranges, symptoms..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};