import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const navItems = [
    { name: 'Virtual Campus Tour', path: '/vctour' },
    { name: 'General Information', path: '/geninfo' },
    { name: 'Cultural Clubs', path: '/cultural' },
    { name: 'Sports Clubs', path: '/sports' },
    { name: 'Placements', path: '/placements' },
    { name: 'Technical Clubs', path: '/technical' },
    { name: 'Academics', path: '/academics' },
];

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowDropdown(true);

        const filtered = navItems.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const getInitials = (username) => {
        const names = username.split(' ');
        return names.map(name => name[0]).join('').toUpperCase();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleResultClick = (path) => {
        setSearchTerm(''); // Clear the search term
        setShowDropdown(false); // Hide the dropdown
        navigate(path);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
            handleSearch({ target: { value: searchTermFromUrl } });
        }
    }, [location.search]);

    return (
        <header className='sticky top-0 z-50 bg-gradient-to-r from-white via-pink-200 to-blue-300 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3 relative'>
                <Link to='/' className="flex items-center space-x-2">
                    <svg
                        className="w-8 h-8"
                        viewBox="0 0 24 24"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        fill="none"
                    >
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#6ee7b7', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#a4c9f4', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <rect x="3" y="1" width="7" height="12" fill="url(#grad1)" />
                        <rect x="3" y="17" width="7" height="6" fill="url(#grad1)" />
                        <rect x="14" y="1" width="7" height="6" fill="url(#grad1)" />
                        <rect x="14" y="11" width="7" height="12" fill="url(#grad1)" />
                    </svg>
                    <h1 className='font-bold text-sm sm:text-xl lg:text-2xl flex items-center'>
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            iiitdmChat
                        </span>
                    </h1>
                </Link>

                <form
                    onSubmit={handleSubmit}
                    className='relative bg-slate-100 p-3 rounded-lg flex items-center'
                >
                    <input
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />
                    <button type="submit">
                        <FaSearch className='text-slate-600' />
                    </button>
                    {showDropdown && filteredItems.length > 0 && (
                        <ul className='absolute bg-white border mt-72 w-full rounded-lg shadow-lg max-h-60 overflow-auto z-10'>
                            {filteredItems.map((item) => (
                                <li
                                    key={item.path}
                                    onClick={() => handleResultClick(item.path)}
                                    className='p-2 cursor-pointer hover:bg-gray-200'
                                >
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
                <ul className='flex gap-4'>
                    <Link to='/'>
                        <li className='hidden sm:inline font-bold text-xl text-slate-700 hover:underline'>
                            Home
                        </li>
                    </Link>
                    <span className='text-slate-700 font-bold text-xl cursor-default'>|</span>
                    <Link to='/about'>
                        <li className='hidden sm:inline font-bold text-xl text-slate-700 hover:underline'>
                            About
                        </li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <div className='flex items-center justify-center rounded-full h-7 w-7 bg-blue-500 text-white font-bold'>
                                {getInitials(currentUser.user.username)}
                            </div>
                        ) : (
                            <button className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-1 rounded-lg transition duration-300">
                                Sign in
                            </button>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
}
