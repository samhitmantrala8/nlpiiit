import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Oops() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { currentUser } = useSelector((state) => state.user);

    const sendMessage = async () => {
        if (!input) return;

        const email = currentUser?.user?.email || '';
        const userMessage = { message: input, email: email };
        setMessages([...messages, { text: input, sender: 'user' }]);
        setInput('');

        try {
            const response = await fetch('http://localhost:5000/oops_acad', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userMessage),
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
                setMessages(prevMessages => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.sender === 'bot') {
                        return [...prevMessages.slice(0, -1), { ...lastMessage, text: text }];
                    }
                    return [...prevMessages, { text, sender: 'bot' }];
                });
            }

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prevMessages => [...prevMessages, { text: 'Error sending message', sender: 'bot' }]);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <nav className='bg-white shadow'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='flex justify-between'>
                        <div className='flex space-x-4'>
                            <div>
                                <Link to='/' className='flex items-center py-5 px-2 text-gray-700 hover:text-gray-900'>
                                    <span className='font-bold'>iiitdmChat</span>
                                </Link>
                            </div>
                            {/* Primary Nav */}
                            <div className='hidden md:flex items-center space-x-1'>
                                <Link to='/vctour' className='py-5 px-3 text-gray-700 hover:text-gray-900'>Virtual Campus Tour</Link>
                                <Link to='/geninfo' className='py-5 px-3 text-gray-700 hover:text-gray-900'>General Information</Link>
                                <Link to='/cultural' className='py-5 px-3 text-gray-700 hover:text-gray-900'>Cultural Clubs</Link>
                                <Link to='/sports' className='py-5 px-3 text-gray-700 hover:text-gray-900'>Sports Clubs</Link>
                                <Link to='/placements' className='py-5 px-3 text-gray-700 hover:text-gray-900'>Placements</Link>
                                <Link to='/technical' className='py-5 px-3 text-gray-700 hover:text-gray-900'>Technical Clubs</Link>
                                <Link to='/academics' className='py-5 px-3 text-gray-700 hover:text-gray-900'>Academics</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Chat Window */}
            <div className="flex-grow p-4 overflow-auto bg-gray-100">
                <div className="chat-window max-w-6xl mx-auto border bg-slate-100 rounded-lg p-4 bg-white">
                    {messages.length === 0 ? (
                        <div className="mt-4 text-center">
                            <p className="p-2 bg-blue-100 text-black rounded-lg inline-block">
                                Ask anything about Object oriented programming!
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`mt-4 message ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <p className={`p-2 rounded-lg inline-block ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                    {msg.text}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white shadow chat-input-container">
                <div className="max-w-6xl mx-auto flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow p-2 border rounded-lg mr-2"
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-lg">Send</button>
                </div>
            </div>
        </div>
    );
}
