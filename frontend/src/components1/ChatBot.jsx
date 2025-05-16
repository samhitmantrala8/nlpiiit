import React from 'react';
import GeneralInfo from './GeneralInfo.jsx';
import Cultural from './Cultural.jsx';
import Sports from './Sports.jsx';
import Placements from './Placements.jsx';
import Technical from './Technical.jsx';
import Academics from './Academics.jsx';

const ChatBot = ({ activeBot, setActiveBot, onClose, className }) => {
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
            default:
                return <GeneralInfo />;
        }
    };

    return (
        <div className={`bg-white shadow-lg rounded-lg flex flex-col ${className}`}>
            {/* Top Bar */}
            <div className="flex items-center p-2 bg-blue-600 text-white rounded-t-lg overflow-x-auto">
                <div className="flex space-x-2">
                    {['CampusConnect'].map((bot) => (
                        <button
                            key={bot}
                            onClick={() => setActiveBot(bot)}
                            className={`px-2 py-1 ${activeBot === bot ? 'bg-blue-700' : ''} rounded text-sm`}
                        >
                            {bot}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="ml-auto text-white font-bold px-2">
                    X
                </button>
            </div>

            {/* Chat Window */}
            <div className="flex-grow p-2 md:p-4 overflow-y-auto bg-gray-100 text-sm md:text-base">
                {renderActiveBot()}
            </div>
        </div>
    );
};

export default ChatBot;
