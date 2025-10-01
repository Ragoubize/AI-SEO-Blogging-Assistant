
import React, { useState } from 'react';
import Button from '../common/Button';

interface Stage1Props {
    onNicheSubmit: (niche: string) => void;
    keywords: string[];
    onKeywordSelect: (keyword: string) => void;
}

const Stage1: React.FC<Stage1Props> = ({ onNicheSubmit, keywords, onKeywordSelect }) => {
    const [nicheInput, setNicheInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nicheInput.trim()) {
            onNicheSubmit(nicheInput.trim());
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-indigo-300">Stage 1: Main Keyword Research</h2>
                <p className="mt-2 text-gray-400">
                    Provide a niche to discover the top main keywords related to your topic. This is the foundation of your content strategy.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={nicheInput}
                    onChange={(e) => setNicheInput(e.target.value)}
                    placeholder="e.g., 'sustainable fashion' or 'home coffee brewing'"
                    className="flex-grow bg-gray-900 border border-gray-600 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <Button type="submit" disabled={!nicheInput.trim()}>
                    Find Keywords
                </Button>
            </form>

            {keywords.length > 0 && (
                <div className="space-y-4 pt-4">
                     <h3 className="text-xl font-semibold text-gray-200">Choose a Keyword to Continue</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {keywords.map((keyword, index) => (
                            <button
                                key={index}
                                onClick={() => onKeywordSelect(keyword)}
                                className="text-left p-4 bg-gray-700 rounded-lg hover:bg-indigo-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <span className="font-medium text-gray-100">{keyword}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stage1;
