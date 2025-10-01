
import React from 'react';

interface HeaderProps {
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b-2 border-indigo-500/30">
            <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    AI SEO & Blogging Assistant
                </h1>
                <p className="mt-1 text-gray-400">Your complete guide to content creation</p>
            </div>
            <button
                onClick={onReset}
                className="mt-4 sm:mt-0 px-5 py-2.5 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-800 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-indigo-500/30"
            >
                Start Over
            </button>
        </header>
    );
};

export default Header;
