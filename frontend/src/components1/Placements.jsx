import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Function to format text with bold, bullet points, and headings
const formatText = (text) => {
    if (typeof text !== 'string') {
        return '';
    }

    // Make text between ** and ** bold
    const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert single * into bullet points
    const bulletPoints = boldText
        .replace(/(?:\n|^) \* /g, '<br/>• ')   // Single * for bullet points
        .replace(/(?:\n|^)•/g, '<br/>•');    // Existing • bullet points

    // Convert headings (e.g., # Heading) into bold
    const headings = bulletPoints.replace(/(^|\n)# (.+)/g, '<br/><strong>$2</strong>');

    return headings;
};

const Placements = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotResponding, setIsBotResponding] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const controllerRef = useRef(null);

  useEffect(() => {
    // Add the welcome message when the component mounts
    setMessages([{ text: 'Welcome to the Placements chatbot! Ask me anything about placements.', sender: 'bot' }]);
  }, []);

  const sendMessage = async () => {
    if (!input) return;

    const email = currentUser?.user?.email || '';
    const userMessage = { message: input, email: email };
    setMessages(prevMessages => {
      // Remove the welcome message if present
      const filteredMessages = prevMessages.filter(msg => msg.text !== 'Welcome to the Placements chatbot! Ask me anything about placements.');
      return [...filteredMessages, { text: input, sender: 'user' }];
    });
    setInput('');
    setIsBotResponding(true);

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const response = await fetch('http://localhost:5000/placement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMessage),
        signal: signal,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let text = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        const formattedText = formatText(text);
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'bot') {
            return [...prevMessages.slice(0, -1), { ...lastMessage, text: formattedText }];
          }
          return [...prevMessages, { text: formattedText, sender: 'bot' }];
        });
      }

    } catch (error) {
      if (signal.aborted) {
        setMessages(prevMessages => [...prevMessages, { text: 'Bot response stopped.', sender: 'bot' }]);
      } else {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error sending message', sender: 'bot' }]);
      }
    } finally {
      setIsBotResponding(false);
    }
  };

  const stopBotResponse = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
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
          onKeyDown={(e) => e.key === 'Enter' && !isBotResponding && sendMessage()}
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
          disabled={isBotResponding}
        />
        {isBotResponding ? (
          <button
            onClick={stopBotResponse}
            className="bg-red-600 text-white p-2 rounded-r-lg hover:bg-red-700 focus:outline-none"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
};

export default Placements;
