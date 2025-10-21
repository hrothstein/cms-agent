import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(`sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        role: 'assistant',
        content: "Hello! 👋 I'm your CMS Admin Assistant. I can help you manage customers and cards through natural language.\n\nTry asking me things like:\n- 'Show me all customers'\n- 'List all cards'\n- 'Get customer details for a specific ID'\n- 'Create a new customer'\n- Type 'help' for more information\n\nWhat would you like to do?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setError(null);

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await api.sendMessage(sessionId, message);

      // Add agent response
      const agentMessage: Message = {
        role: 'assistant',
        content: response.data.agentResponse,
        timestamp: response.data.timestamp,
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.response?.data?.error || err.message || 'Unknown error'}. Please try again.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsTyping(false);
    }
  };

  const clearConversation = async () => {
    try {
      await api.clearHistory(sessionId);
      setMessages([
        {
          role: 'assistant',
          content: "Conversation cleared. How can I help you?",
          timestamp: new Date().toISOString(),
        },
      ]);
      setError(null);
    } catch (err: any) {
      console.error('Failed to clear conversation:', err);
      setError('Failed to clear conversation');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">CMS Admin Agent</h1>
              <p className="text-xs text-blue-100 mt-0.5">Powered by Azure OpenAI • gpt-5-mini</p>
            </div>
          </div>
          <button
            onClick={clearConversation}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 text-sm font-semibold backdrop-blur-sm border border-white/20 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-fadeIn">
          <div className="flex max-w-5xl mx-auto">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-lg shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
