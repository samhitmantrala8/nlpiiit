import React, { useState, useEffect } from 'react';
import ChatBot from './components1/ChatBot.jsx';
import bg from './assets/bg.jpg';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeBot, setActiveBot] = useState('Cultural Clubs');

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  const handleKeyPress = (e) => {
    if (e.altKey && e.shiftKey && e.key === 'M') {
      toggleChat();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col md:flex-row justify-center items-center px-4"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="text-center bg-white bg-opacity-70 p-6 md:p-8 rounded-lg shadow-lg max-w-full w-full md:w-[800px]">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Explore life at IIIT Jabalpur with Our ChatBot!
        </h1>

        <p className="mt-4 text-gray-700 text-sm md:text-base">
          Get quick and accurate answers about everything on campus - from <span className="font-semibold">hostels</span> and <span className="font-semibold">academics</span>, to <span className="font-semibold">placements</span>, <span className="font-semibold">technical & cultural clubs</span>, and more. Whether you're a curious visitor or a current student, we're here to guide you through the vibrant life at <span className="font-semibold">IIITDM-J</span>.
        </p>

        <p className="mt-4 text-gray-600 text-sm md:text-base">
          Press <span className="font-semibold">Alt+Shift+M</span> to {isChatOpen ? 'close' : 'access'} the Bot
        </p>
      </div>

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg focus:outline-none"
      >
        Chat
      </button>

      {/* ChatBot Component */}
      {isChatOpen && (
        <ChatBot
          activeBot={activeBot}
          setActiveBot={setActiveBot}
          onClose={toggleChat}
          className="fixed bottom-4 right-4 w-[95%] h-[85%] sm:w-[80%] md:w-2/5 md:h-[90%]"
        />
      )}
    </div>
  );
};

export default App;
