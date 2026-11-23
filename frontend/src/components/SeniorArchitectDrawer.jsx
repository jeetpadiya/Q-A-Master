import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { askSeniorArchitectApi } from '../services/api';
import { playTactilePop } from '../utils/sound';

const QUICK_PROMPTS = [
  'Explain the runtime call stack and memory allocation',
  'Show the production-grade architectural fix with best practices',
  'What edge cases occur with this under high concurrency?',
  'How would a Principal Engineer probe this in an interview?',
];

const SeniorArchitectDrawer = ({ isOpen, onClose, questionContext }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Initial analysis when opened for a new question
  useEffect(() => {
    if (!isOpen || !questionContext) return;

    // Reset messages and load initial Senior Architect breakdown
    const fetchInitialBreakdown = async () => {
      setIsThinking(true);
      setMessages([]);

      try {
        const { data } = await askSeniorArchitectApi({
          questionContext,
          userMessage:
            'Please give me a high-signal senior architect breakdown of this concept, the underlying runtime mechanics, and the proper production pattern.',
        });

        if (data.success && data.reply) {
          setMessages([
            {
              role: 'assistant',
              content: data.reply,
              model: data.model || 'gemini-3.8-flash',
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to consult Senior Architect:', err);
        setMessages([
          {
            role: 'assistant',
            content:
              '⚠️ Unable to establish connection to the Senior Architect engine right now. Please check your network or try again.',
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    };

    fetchInitialBreakdown();
  }, [isOpen, questionContext]);

  // Handle keyboard Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    playTactilePop();
    setInputText('');

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsThinking(true);

    try {
      const { data } = await askSeniorArchitectApi({
        questionContext,
        messageHistory: newMessages,
        userMessage: text,
      });

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            model: data.model,
          },
        ]);
      } else {
        toast.error('Failed to get architect response');
      }
    } catch (err) {
      console.error('Error in architect chat:', err);
      toast.error('Senior Architect service unreachable');
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl border-l border-zinc-800 bg-[#0c0c0e] shadow-2xl flex flex-col font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121215]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm sm:text-base font-bold text-zinc-100 font-mono">
                  Ask the Senior Architect
                </h2>
              </div>
              <p className="text-[11px] font-mono text-zinc-500">
                Staff/Principal Mentorship · Gemini 3.8 Engine
              </p>
            </div>

            <button
              onClick={() => {
                playTactilePop();
                onClose();
              }}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Active Context Banner */}
          {questionContext && (
            <div className="px-6 py-3 bg-zinc-900/50 border-b border-zinc-800/80 text-xs font-mono flex items-center justify-between text-zinc-400">
              <div className="truncate pr-2">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] mr-1.5 font-bold">
                  Target:
                </span>
                <span className="text-zinc-200 font-medium">
                  {questionContext.topic || questionContext.category || 'System Architecture'}
                </span>
              </div>
              <span className="shrink-0 rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400 border border-zinc-700/60">
                {questionContext.category || 'Code Review'}
              </span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-zinc-500">
                    <span>{isAssistant ? 'Principal Architect' : 'You'}</span>
                    {msg.model && (
                      <span className="text-[10px] text-zinc-600">({msg.model})</span>
                    )}
                  </div>

                  <div
                    className={`rounded-xl p-4 max-w-[92%] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isAssistant
                        ? 'border border-zinc-800 bg-[#141417] text-zinc-200'
                        : 'bg-zinc-800 text-zinc-100 font-sans border border-zinc-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex flex-col items-start space-y-1">
                <span className="text-[11px] font-mono text-zinc-500">
                  Principal Architect is analyzing...
                </span>
                <div className="rounded-xl border border-zinc-800 bg-[#141417] px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="font-mono text-zinc-500 ml-1">Formulating runtime breakdown</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Follow-up Prompts */}
          <div className="px-6 py-2.5 border-t border-zinc-800/80 bg-zinc-950/60 overflow-x-auto select-none">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5 font-bold">
              Suggested Architectural Probes:
            </p>
            <div className="flex gap-2">
              {QUICK_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isThinking}
                  className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box Footer */}
          <div className="p-4 border-t border-zinc-800 bg-[#121215]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask technical question (e.g. 'Why does Object.is bail out here?')..."
                disabled={isThinking}
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-sans"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isThinking}
                className={`btn-primary py-2.5 px-4 text-xs font-mono flex items-center gap-1.5 ${
                  !inputText.trim() || isThinking ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Ask</span>
                <span className="font-mono text-[10px]">↵</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorArchitectDrawer;
