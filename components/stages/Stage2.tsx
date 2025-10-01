
import React from 'react';
import type { SeedKeyword } from '../../types';

interface Stage2Props {
    keyword: string;
    seedKeywords: SeedKeyword[];
    onSeedKeywordSelect: (keyword: SeedKeyword) => void;
}

const Stage2: React.FC<Stage2Props> = ({ keyword, seedKeywords, onSeedKeywordSelect }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-indigo-300">Stage 2: Seed Keywords for "{keyword}"</h2>
                <p className="mt-2 text-gray-400">
                    Here are related keywords with estimated metrics. Select one to expand on and build your content around.
                </p>
            </div>
            
            <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-gray-700">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-indigo-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Keyword</th>
                            <th scope="col" className="px-6 py-3">Search Volume</th>
                            <th scope="col" className="px-6 py-3">Ranking Difficulty</th>
                            <th scope="col" className="px-6 py-3">CPC</th>
                            <th scope="col" className="px-6 py-3">Blog Post Topic</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seedKeywords.map((item, index) => (
                            <tr
                                key={index}
                                className="bg-gray-800/50 border-b border-gray-700 hover:bg-indigo-900/30 cursor-pointer transition-colors"
                                onClick={() => onSeedKeywordSelect(item)}
                            >
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.keyword}</th>
                                <td className="px-6 py-4">{item.searchVolume}</td>
                                <td className="px-6 py-4">{item.rankingDifficulty}</td>
                                <td className="px-6 py-4">{item.cpc}</td>
                                <td className="px-6 py-4">{item.blogPostTopic}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Stage2;
