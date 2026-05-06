'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ChatMessageComp from '@/components/ChatMessage';
import { DEMO_CHAT_MESSAGES } from '@/lib/demo-data';
import { ChatMessage } from '@/lib/firestore-schema';
import { Send, Loader, Camera, UtensilsCrossed, TrendingUp, Sparkles } from 'lucide-react';

const quickActions = [
  { icon: Camera, label: 'What should I eat after a workout?' },
  { icon: UtensilsCrossed, label: 'Suggest a high-protein dinner' },
  { icon: TrendingUp, label: 'How am I doing with my goals?' },
  { icon: Sparkles, label: 'Give me a healthy snack idea' },
];

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!user) router.push('/'); }, [user, router]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  if (!user) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10),
          userContext: { healthGoal: user.healthGoal, restrictions: user.dietaryRestrictions },
        }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again! 🙏", timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errMsg]);
    }
    setSending(false);
  };

  return (
    <div className="page-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : undefined, display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1>AI Health Coach 🤖</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Powered by Gemini 1.5 Pro · Your personal nutritionist</p>
          </div>
          <span className="badge badge-success">● Online</span>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, marginBottom: 16 }}>
          {messages.map(msg => (
            <ChatMessageComp key={msg.id} message={msg} />
          ))}
          {sending && (
            <div style={{ display: 'flex', gap: 12, padding: '12px 0' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader size={16} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <div style={{ padding: '12px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '4px 16px 16px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {quickActions.map((a, i) => (
              <button key={i} className="btn btn-secondary btn-sm" onClick={() => sendMessage(a.label)}
                style={{ fontSize: '0.75rem' }}>
                <a.icon size={12} /> {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: 'flex', gap: 12, padding: '16px 0', borderTop: '1px solid var(--border-glass)' }}>
          <input
            className="input"
            placeholder="Ask about nutrition, meal ideas, or health tips..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            disabled={sending}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={sending || !input.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
