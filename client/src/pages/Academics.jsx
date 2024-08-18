import React from 'react';
import { Link } from 'react-router-dom';

export default function Academics() {
    return (
        <div>
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

            {/* Cards */}
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <Link to='/dbms' className='block bg-white shadow-lg rounded-lg overflow-hidden h-48'>
                        <div className='p-6'>
                            <h2 className='font-bold text-xl mb-2'>Database Management Systems</h2>
                            <p className='text-gray-700'>Learn about database concepts, SQL, and data modeling.</p>
                        </div>
                    </Link>
                    <Link to='/os' className='block bg-white shadow-lg rounded-lg overflow-hidden h-48'>
                        <div className='p-6'>
                            <h2 className='font-bold text-xl mb-2'>Operating Systems</h2>
                            <p className='text-gray-700'>Explore operating system concepts, processes, and memory management.</p>
                        </div>
                    </Link>
                    <Link to='/oops' className='block bg-white shadow-lg rounded-lg overflow-hidden h-48'>
                        <div className='p-6'>
                            <h2 className='font-bold text-xl mb-2'>Object Oriented Programming</h2>
                            <p className='text-gray-700'>Understand OOP principles, classes, and objects.</p>
                        </div>
                    </Link>
                    <Link to='/cn' className='block bg-white shadow-lg rounded-lg overflow-hidden h-48'>
                        <div className='p-6'>
                            <h2 className='font-bold text-xl mb-2'>Computer Networks</h2>
                            <p className='text-gray-700'>Dive into network protocols, topologies, and security.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
