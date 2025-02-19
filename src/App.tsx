import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { useChatStore } from './store/chat-store';
import { MessageSquare, Loader2, Trash2, RefreshCw, Menu } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyBPbDdUR8WUaBMYnKBzhmbzMZwvHCjcBik';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function App() {
  const { messages, isLoading, addMessage, fetchMessages, clearMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    await addMessage({ role: 'user', content });

    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: content
            }]
          }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      await addMessage({ role: 'assistant', content: aiResponse });
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      await addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      });
    }
  };

  const handleRefresh = () => {
    fetchMessages();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 transition-all duration-300 overflow-hidden flex flex-col border-r border-gray-700`}>
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={clearMessages}
            className="w-full flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Recent chats would go here */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center gap-4 border-b border-gray-700">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold text-white flex-1">AI Chat Assistant</h1>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh messages"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={clearMessages}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-900">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <MessageSquare className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat Assistant</h2>
              <p className="text-center max-w-md text-gray-500">
                Start a conversation with your AI assistant. Ask questions, get help, or just chat!
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div key={message.id} className={message.role === 'assistant' ? 'bg-gray-800/50' : ''}>
                  <div className="max-w-3xl mx-auto px-4 py-6">
                    <ChatMessage
                      role={message.role}
                      content={message.content}
                      timestamp={new Date(message.createdAt).toLocaleTimeString()}
                    />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-gray-400 bg-gray-800/90 px-4 py-2 rounded-full shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;