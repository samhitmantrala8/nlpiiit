import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const formatText = (text) => {
    if (typeof text !== 'string') return '';

    // Bold text between ** and **
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet points with *
    formatted = formatted.replace(/(?:\n|^) \* /g, '<br/>• ');
    formatted = formatted.replace(/(?:\n|^)•/g, '<br/>•');

    // Detect and hyperlink URLs
    formatted = formatted.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return formatted;
};

const Cultural = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isBotResponding, setIsBotResponding] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const controllerRef = useRef(null);

    useEffect(() => {
        setMessages([
            {
                text: 'Hey there! Welcome to Campus-Connect. I am here to help you with anything related to campus life - from academics and hostels to clubs and placements. Just ask away!',
                sender: 'bot',
            },
        ]);
    }, []);

    const sendMessage = async () => {
        if (!input || isBotResponding) return;

        const email = currentUser?.user?.email || '';
        const userMessage = { message: input, email: email };

        setMessages((prev) => {
            const filtered = prev.filter(
                (msg) =>
                    msg.text !==
                    'Hey there! Welcome to Campus-Connect. I am here to help you with anything related to campus life - from academics and hostels to clubs and placements. Just ask away!'
            );
            return [...filtered, { text: input, sender: 'user' }];
        });

        setInput('');
        setIsBotResponding(true);
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            const response = await fetch('http://localhost:5000/cul_resp', {
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
                setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last && last.sender === 'bot') {
                        return [...prev.slice(0, -1), { ...last, text: formattedText }];
                    }
                    return [...prev, { text: formattedText, sender: 'bot' }];
                });
            }
        } catch (error) {
            if (signal.aborted) {
                setMessages((prev) => [...prev, { text: 'Bot response stopped.', sender: 'bot' }]);
            } else {
                console.error('Error sending message:', error);
                setMessages((prev) => [...prev, { text: 'Error sending message', sender: 'bot' }]);
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full p-4 bg-white rounded-lg shadow-md">
            <div className="flex-grow overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-3 rounded-lg max-w-full break-words ${
                            msg.sender === 'user'
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

export default Cultural;
