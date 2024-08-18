import React from 'react';

const Card = ({ image, title, desc }) => {
    return (
        <div className="relative bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
            <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative flex items-center justify-center h-48">
                <h3 className="text-xl md:text-2xl font-bold transition-opacity duration-300 group-hover:opacity-0">{title}</h3>
                <p className="absolute text-lg font-bold inset-0 flex items-center justify-center text-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {desc}
                </p>
            </div>
        </div>
    );
};

export default Card;
