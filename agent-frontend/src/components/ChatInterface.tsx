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
        content: "Hello! I'm your CMS Admin Assistant. I can help you manage customers and cards through natural language.\n\nTry asking me things like:\n- 'Show me all customers'\n- 'List all cards'\n- 'Get customer details for a specific ID'\n- 'Create a new customer'\n- Type 'help' for more information\n\nWhat would you like to do?",
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">CMS Admin Agent</h1>
            <p className="text-sm text-blue-100 mt-1">
              Conversational AI for Customer & Card Management
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearConversation}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors font-medium text-sm"
              title="Clear conversation"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

