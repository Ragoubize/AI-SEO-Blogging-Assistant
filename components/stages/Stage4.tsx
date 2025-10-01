
import React, { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import type { KeywordExpansionData, SelectedExpansionDetails } from '../../types';

interface Stage4Props {
    blogPost: string;
    onGenerate: (country: string) => void;
    mainKeyword: string;
    details: KeywordExpansionData;
    selection: SelectedExpansionDetails;
}

// Simple markdown to HTML renderer
const RenderMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/^(#+)\s*(.*)/gm, (match, hashes, text) => { // Headers
            const level = hashes.length;
            return `<h${level} class="text-xl font-bold mt-4 mb-2">${text}</h${level}>`;
        })
        .replace(/^\s*-\s+(.*)/gm, '<li class="ml-6">$1</li>') // List items
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'); // Wrap lists

    return (
        <div 
            className="prose prose-invert prose-p:text-gray-300 prose-strong:text-white prose-em:text-indigo-300 prose-headings:text-indigo-300" 
            dangerouslySetInnerHTML={{ __html: formattedContent }} 
        />
    );
}

const Stage4: React.FC<Stage4Props> = ({ blogPost, onGenerate, mainKeyword, details, selection }) => {
    const [country, setCountry] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        if (country.trim()) {
            onGenerate(country.trim());
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(blogPost);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (blogPost) {
        return (
            <div className="space-y-6">
                 <div>
                    <h2 className="text-2xl font-bold text-indigo-300">Your Blog Post is Ready!</h2>
                    <p className="mt-2 text-gray-400">
                        Review the generated content below. You can copy it to your clipboard for publishing.
                    </p>
                </div>
                <Card>
                    <div className="relative">
                        <button onClick={handleCopy} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm">
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <div className="p-4 whitespace-pre-wrap font-serif text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto">
                           <RenderMarkdown content={blogPost} />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-indigo-300">Stage 4: Create Blog Content</h2>
                <p className="mt-2 text-gray-400">
                    Provide the target country for your audience to tailor the content's tone and references.
                </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
                 <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., 'United States'"
                    className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <Button onClick={handleGenerate} disabled={!country.trim()} className="w-full">
                    Generate Blog Post
                </Button>
            </div>
            
            <div className="pt-4">
                <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">Content Summary</h3>
                <Card className="max-w-2xl mx-auto">
                    <p><strong>Main Keyword:</strong> <span className="text-indigo-300">{mainKeyword}</span></p>
                    <p className="mt-2"><strong>Included Sections:</strong></p>
                    <ul className="list-disc list-inside text-gray-400">
                        {selection.faqs && <li>Frequently Asked Questions</li>}
                        {selection.coreKeywords && <li>Core Keywords</li>}
                        {selection.secondaryKeywords && <li>Secondary Keywords</li>}
                        {selection.productRecommendations && <li>Product Recommendations</li>}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Stage4;
