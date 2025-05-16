import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const formatText = (text) => {
  if (typeof text !== 'string') return '';

  // Make text between ** and ** bold
  const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert single * into bullet points
  const bulletPoints = boldText
    .replace(/(?:\n|^) \* /g, '<br/>• ')
    .replace(/(?:\n|^)•/g, '<br/>•');

  return bulletPoints;
};

const GenInfo = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotResponding, setIsBotResponding] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const controllerRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        text: formatText('**Hey there!** Welcome to Campus-Connect. I am here to help you with anything related to campus life — from academics and hostels to clubs and placements. Just ask away!'),
        sender: 'bot'
      }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input || isBotResponding) return;

    const email = currentUser?.user?.email || '';
    const userMessage = { message: input, email };
    setMessages(prev => {
      const welcomeRemoved = prev.filter(msg =>
        !msg.text.includes('Campus-Connect')
      );
      return [...welcomeRemoved, { text: input, sender: 'user' }];
    });
    setInput('');
    setIsBotResponding(true);

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const response = await fetch('http://localhost:5000/geninfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMessage),
        signal
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let text = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        const formattedText = formatText(text);

        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.sender === 'bot') {
            return [...prev.slice(0, -1), { ...last, text: formattedText }];
          }
          return [...prev, { text: formattedText, sender: 'bot' }];
        });
      }

    } catch (error) {
      if (signal.aborted) {
        setMessages(prev => [...prev, { text: 'Bot response stopped.', sender: 'bot' }]);
      } else {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { text: 'Error sending message.', sender: 'bot' }]);
      }
    } finally {
      setIsBotResponding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const stopBotResponse = () => {
    if (controllerRef.current) controllerRef.current.abort();
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex-grow overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-full break-words text-sm md:text-base whitespace-pre-wrap ${msg.sender === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-gray-800 self-start'
              }`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
          disabled={isBotResponding}
        />
        <button
          onClick={isBotResponding ? stopBotResponse : sendMessage}
          className={`p-2 rounded-r-lg text-white ${isBotResponding ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none`}
        >
          {isBotResponding ? 'Stop' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default GenInfo;
