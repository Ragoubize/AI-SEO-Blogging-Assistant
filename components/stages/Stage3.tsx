
import React, { useState } from 'react';
import type { KeywordExpansionData, SelectedExpansionDetails, ProductRecommendation } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface Stage3Props {
    keyword: string;
    data: KeywordExpansionData;
    onExpansionSelect: (details: SelectedExpansionDetails) => void;
}

const SectionCard: React.FC<{ title: string, children: React.ReactNode, isChecked: boolean, onToggle: () => void }> = ({ title, children, isChecked, onToggle }) => (
    <Card className="flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-600">
            <h3 className="text-lg font-bold text-indigo-300">{title}</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={isChecked} onChange={onToggle} className="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium">Include</span>
            </label>
        </div>
        <div className="flex-grow overflow-y-auto max-h-64 pr-2">{children}</div>
    </Card>
);

const Stage3: React.FC<Stage3Props> = ({ keyword, data, onExpansionSelect }) => {
    const [selection, setSelection] = useState<SelectedExpansionDetails>({
        faqs: true,
        coreKeywords: true,
        secondaryKeywords: true,
        productRecommendations: true,
    });

    const handleToggle = (key: keyof SelectedExpansionDetails) => {
        setSelection(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = () => {
        onExpansionSelect(selection);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-indigo-300">Stage 3: Expand on "{keyword}"</h2>
                <p className="mt-2 text-gray-400">
                    Select the elements you want to include in your blog post. These details will form the core of your content.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard title="Frequently Asked Questions" isChecked={selection.faqs} onToggle={() => handleToggle('faqs')}>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {data.faqs.map((faq, i) => <li key={i}>{faq}</li>)}
                    </ul>
                </SectionCard>

                <SectionCard title="Core Keywords" isChecked={selection.coreKeywords} onToggle={() => handleToggle('coreKeywords')}>
                    <div className="flex flex-wrap gap-2">
                        {data.coreKeywords.map((kw, i) => <span key={i} className="bg-indigo-900/50 text-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>)}
                    </div>
                </SectionCard>

                <SectionCard title="Secondary Keywords" isChecked={selection.secondaryKeywords} onToggle={() => handleToggle('secondaryKeywords')}>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {data.secondaryKeywords.map((kw, i) => <li key={i}>{kw}</li>)}
                    </ul>
                </SectionCard>

                <SectionCard title="Product Recommendations" isChecked={selection.productRecommendations} onToggle={() => handleToggle('productRecommendations')}>
                     <div className="space-y-3">
                        {data.productRecommendations.map((p, i) => (
                            <div key={i} className="text-sm">
                                <a href={p.link} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-400 hover:underline">{p.name}</a>
                                <p className="text-gray-400 text-xs">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
            
            <div className="text-center pt-4">
                <Button onClick={handleSubmit}>
                    Continue to Blog Creation
                </Button>
            </div>
        </div>
    );
};

export default Stage3;
