import React from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className="flex items-start gap-4">
      <div className={cn(
        'w-8 h-8 rounded-sm flex items-center justify-center',
        isUser ? 'bg-[#5437DB]' : 'bg-[#11A37F]'
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white">
            {isUser ? 'You' : 'Assistant'}
          </p>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
};