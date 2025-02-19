import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => Promise<void>;
  fetchMessages: () => Promise<void>;
  clearMessages: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: async (message) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            role: message.role,
            content: message.content,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding message:', error);
        set({ isLoading: false });
        return;
      }

      set((state) => ({
        messages: [...state.messages, data[0] as Message],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error adding message:', error);
      set({ isLoading: false });
    }
  },
  fetchMessages: async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      set({ messages: data as Message[] });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },
  clearMessages: async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all messages

      if (error) {
        console.error('Error clearing messages:', error);
        return;
      }

      set({ messages: [] });
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  },
}));