import React, { useState, useEffect } from 'react';
import ChatBot from './components1/ChatBot.jsx';
import bg from './assets/bg.jpg';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeBot, setActiveBot] = useState('Cultural Clubs'); // Default bot

  // Function to toggle chatbot visibility
  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  // Handle keypress events to toggle chat
  const handleKeyPress = (e) => {
    if (e.altKey && e.shiftKey && e.key === 'M') {
      toggleChat();
    }
  };

  // Attach and detach keypress event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div 
      className="relative min-h-screen flex justify-center items-center" 
      style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="text-center bg-white bg-opacity-75 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to iiitdmChat</h1>
        <p className="mt-4 text-gray-600">Press <span className='font-semibold'>Alt+Shift+M</span> to {isChatOpen?'close':'access'} the Bot</p>
      </div>

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-full shadow-lg focus:outline-none"
      >
        Chat
      </button>

      {/* ChatBot Component */}
      {isChatOpen && (
        <ChatBot
          activeBot={activeBot}
          setActiveBot={setActiveBot}
          onClose={toggleChat}
          className="fixed bottom-0 left-0 w-1/3 h-full" // Adjusted width to 1/3
        />
      )}
    </div>
  );
};

export default App;
