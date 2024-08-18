import React from 'react';
import { Link } from 'react-router-dom';

export default function VirtualCampusTour() {
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

            {/* Main Content */}
            <div className='max-w-6xl mx-auto p-6'>

                <h2 className='text-slate-700 font-bold text-3xl lg:text-5xl mb-2'>
                    Virtual Campus Tour
                </h2>
                <div className='mb-4'>
                    <div className='text-gray-600 mt-2 '>
                        <p>
                            Explore our beautiful campus, see the facilities, and get a glimpse of student life. We hope this tour helps you feel more connected to our community and excited about the opportunities here.
                        </p>
                    </div>
                </div>
                <div className='relative pb-9/16' style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        className='absolute top-0 left-0 w-full h-full'
                        src='https://www.youtube.com/embed/8FRWlDtViuc?si=FpmhgghZRLoOx9OD'
                        title='Virtual Campus Tour'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        referrerPolicy='strict-origin-when-cross-origin'
                    ></iframe>
                </div>

            </div>
        </div>
    );
}
