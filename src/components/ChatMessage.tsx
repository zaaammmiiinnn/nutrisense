'use client';
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/lib/firestore-schema';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isAI = message.role === 'assistant';

  return (
    <div className="animate-fade-in" style={{
      display: 'flex', gap: 12, padding: '12px 0',
      flexDirection: isAI ? 'row' : 'row-reverse',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 'var(--radius-full)', flexShrink: 0,
        background: isAI ? 'var(--gradient-accent)' : 'var(--bg-glass)',
        border: isAI ? 'none' : '1px solid var(--border-glass)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isAI ? <Bot size={18} color="#fff" /> : <User size={18} color="var(--text-secondary)" />}
      </div>
      <div style={{
        maxWidth: '70%', padding: '12px 16px',
        background: isAI ? 'var(--bg-glass)' : 'rgba(16,185,129,0.1)',
        border: `1px solid ${isAI ? 'var(--border-glass)' : 'rgba(16,185,129,0.2)'}`,
        borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)',
      }}>
        {message.content}
      </div>
    </div>
  );
}
