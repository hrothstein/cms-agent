import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAgent = message.role === 'assistant';

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`message-bubble ${isAgent ? '' : 'user'}`}>
      {isAgent && (
        <div className="message-avatar agent">
          AI
        </div>
      )}
      <div className={`message-content ${isAgent ? 'agent' : 'user'}`}>
        <div className="message-text">{message.content}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
      {!isAgent && (
        <div className="message-avatar user">
          U
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
