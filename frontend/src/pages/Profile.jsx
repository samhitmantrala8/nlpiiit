import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart } from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        localStorage.clear();
        dispatch(signOutUserStart());
        window.location.href = '/'; // Redirect to home page
        console.log('Successfully signed out');
      } else {
        console.error('Sign-out failed:', res.statusText);
      }
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/chat-history', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched chat history:', data);
          setChatHistory(data);
        } else {
          console.error('Failed to fetch chat history:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error.message);
      }
    };

    fetchChatHistory();
  }, []);

  const username = currentUser?.user?.username || 'Not available';
  const email = currentUser?.user?.email || 'Not available';

  const nextChat = () => {
    setCurrentChatIndex((prevIndex) => (prevIndex + 1) % chatHistory.length);
  };

  const prevChat = () => {
    setCurrentChatIndex((prevIndex) => (prevIndex - 1 + chatHistory.length) % chatHistory.length);
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-7 border-b pb-5">
        <div>
          <h1 className="text-3xl font-semibold">{username}</h1>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-95 transition duration-300 mt-4 md:mt-0"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-center mb-5">Chat History</h2>
        {chatHistory.length > 0 ? (
          <div className="relative">
            <div className="border rounded-lg bg-transparent p-6 h-80 flex items-center justify-center overflow-y-auto">
              <div className="max-h-full w-full">
                {chatHistory[currentChatIndex].user_message && (
                  <div className={`p-3 rounded-lg mb-4 ${chatHistory[currentChatIndex].user_email === email ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <p>{chatHistory[currentChatIndex].user_message}</p>
                  </div>
                )}
                {chatHistory[currentChatIndex].bot_response && (
                  <div className={`p-3 rounded-lg ${chatHistory[currentChatIndex].user_email !== email ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                    <p>{chatHistory[currentChatIndex].bot_response}</p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={prevChat}
              className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full border-2 border-gray-400 font-bold hover:bg-gray-400 transition duration-300"
            >
              &lt;
            </button>
            <button
              onClick={nextChat}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full border-2 border-gray-400 font-bold hover:bg-gray-400 transition duration-300"
            >
              &gt;
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No chat history available.</p>
        )}
      </div>
      {error && <p className="text-red-700 mt-5 text-center">{error}</p>}
    </div>
  );
}
