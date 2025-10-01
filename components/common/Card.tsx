
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const interactiveClasses = onClick ? 'cursor-pointer hover:bg-gray-700 hover:border-indigo-500 transition-all duration-200' : '';

    return (
        <div 
            className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${interactiveClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
