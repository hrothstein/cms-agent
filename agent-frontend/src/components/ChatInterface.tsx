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
        content: "Hello! 👋 I'm your CMS Admin Assistant. I can help you manage customers and cards through natural language.\n\nTry asking me things like:\n• 'Show me all customers'\n• 'List all cards'\n• 'Get customer details for a specific ID'\n• 'Create a new customer'\n• Type 'help' for more information\n\nWhat would you like to do?",
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
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-title">
          <div style={{ fontSize: '32px' }}>💬</div>
          <div>
            <h1>CMS Admin Agent</h1>
            <p>Conversational AI for Customer & Card Management</p>
          </div>
        </div>
        <button onClick={clearConversation} className="clear-button">
          🗑️ Clear Chat
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">
            ✕
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
