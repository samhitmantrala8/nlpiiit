import React from 'react';
import GeneralInfo from './GeneralInfo.jsx';
import Cultural from './Cultural.jsx';
import Sports from './Sports.jsx';
import Placements from './Placements.jsx';
import Technical from './Technical.jsx';
import Academics from './Academics.jsx';

const ChatBot = ({ activeBot, setActiveBot, onClose }) => {
    const renderActiveBot = () => {
        switch (activeBot) {
            case 'General Information':
                return <GeneralInfo />;
            case 'Cultural Clubs':
                return <Cultural />;
            case 'Sports Clubs':
                return <Sports />;
            case 'Placements':
                return <Placements />;
            case 'Technical Clubs':
                return <Technical />;
            case 'Academics':
                return <Academics />;
            default:
                return <Cultural />;
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-1/3 h-full bg-white shadow-lg rounded-lg flex flex-col">

            {/* Top Bar */}
            <div className="flex items-center p-2 bg-blue-600 text-white rounded-t-lg overflow-x-auto">
                <div className="flex space-x-2">
                    {['General Information', 'Cultural Clubs', 'Sports Clubs', 'Placements', 'Technical Clubs', 'Academics'].map((bot) => (
                        <button
                            key={bot}
                            onClick={() => setActiveBot(bot)}
                            className={`px-2 py-1 ${activeBot === bot ? 'bg-blue-700' : ''} rounded`}
                        >
                            {bot}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="ml-auto text-white font-bold">
                    X
                </button>
            </div>

            {/* Chat Window */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
                {renderActiveBot()}
            </div>
        </div>
    );
};

export default ChatBot;
