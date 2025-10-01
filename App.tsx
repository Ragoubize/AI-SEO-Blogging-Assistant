
import React, { useState, useCallback } from 'react';
import { Stage } from './types';
import type { SeedKeyword, KeywordExpansionData, SelectedExpansionDetails } from './types';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import Stage1 from './components/stages/Stage1';
import Stage2 from './components/stages/Stage2';
import Stage3 from './components/stages/Stage3';
import Stage4 from './components/stages/Stage4';
import { getMainKeywords, getSeedKeywords, getKeywordExpansion, createBlogPost } from './services/geminiService';
import LoadingSpinner from './components/common/LoadingSpinner';

const App: React.FC = () => {
    const [stage, setStage] = useState<Stage>(Stage.MainKeywords);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Stage 1 data
    const [niche, setNiche] = useState<string>('');
    const [mainKeywords, setMainKeywords] = useState<string[]>([]);
    
    // Stage 2 data
    const [selectedMainKeyword, setSelectedMainKeyword] = useState<string>('');
    const [seedKeywords, setSeedKeywords] = useState<SeedKeyword[]>([]);

    // Stage 3 data
    const [selectedSeedKeyword, setSelectedSeedKeyword] = useState<SeedKeyword | null>(null);
    const [expansionData, setExpansionData] = useState<KeywordExpansionData | null>(null);

    // Stage 4 data
    const [selectedExpansionDetails, setSelectedExpansionDetails] = useState<SelectedExpansionDetails | null>(null);
    const [blogPost, setBlogPost] = useState<string>('');

    const handleReset = () => {
        setStage(Stage.MainKeywords);
        setIsLoading(false);
        setError(null);
        setNiche('');
        setMainKeywords([]);
        setSelectedMainKeyword('');
        setSeedKeywords([]);
        setSelectedSeedKeyword(null);
        setExpansionData(null);
        setSelectedExpansionDetails(null);
        setBlogPost('');
    };

    const handleError = (message: string) => {
        setError(message);
        setIsLoading(false);
    };

    const handleNicheSubmit = useCallback(async (submittedNiche: string) => {
        setIsLoading(true);
        setError(null);
        setNiche(submittedNiche);
        try {
            const keywords = await getMainKeywords(submittedNiche);
            setMainKeywords(keywords);
        } catch (err) {
            handleError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMainKeywordSelect = useCallback(async (keyword: string) => {
        setIsLoading(true);
        setError(null);
        setSelectedMainKeyword(keyword);
        try {
            const seedData = await getSeedKeywords(keyword);
            setSeedKeywords(seedData);
            setStage(Stage.SeedKeywords);
        } catch (err) {
            handleError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSeedKeywordSelect = useCallback(async (keyword: SeedKeyword) => {
        setIsLoading(true);
        setError(null);
        setSelectedSeedKeyword(keyword);
        try {
            const expansion = await getKeywordExpansion(keyword.keyword);
            setExpansionData(expansion);
            setStage(Stage.KeywordExpansion);
        } catch (err) {
            handleError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleExpansionSelect = useCallback((details: SelectedExpansionDetails) => {
        setSelectedExpansionDetails(details);
        setStage(Stage.BlogCreation);
    }, []);

    const handleBlogGeneration = useCallback(async (country: string) => {
        if (!selectedSeedKeyword || !expansionData || !selectedExpansionDetails) {
            handleError("Missing data to generate blog post.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const post = await createBlogPost({
                mainKeyword: selectedSeedKeyword.keyword,
                country,
                expansionData,
                selection: selectedExpansionDetails,
            });
            setBlogPost(post);
        } catch (err) {
            handleError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedSeedKeyword, expansionData, selectedExpansionDetails]);

    const renderStage = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
        }
        if (error) {
            return (
                 <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
                    <h3 className="text-xl font-bold text-red-400 mb-2">An Error Occurred</h3>
                    <p className="text-red-300">{error}</p>
                    <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                        Try Again
                    </button>
                </div>
            );
        }

        switch (stage) {
            case Stage.MainKeywords:
                return <Stage1 onNicheSubmit={handleNicheSubmit} keywords={mainKeywords} onKeywordSelect={handleMainKeywordSelect} />;
            case Stage.SeedKeywords:
                return <Stage2 keyword={selectedMainKeyword} seedKeywords={seedKeywords} onSeedKeywordSelect={handleSeedKeywordSelect} />;
            case Stage.KeywordExpansion:
                 if (!selectedSeedKeyword || !expansionData) return null;
                return <Stage3 keyword={selectedSeedKeyword.keyword} data={expansionData} onExpansionSelect={handleExpansionSelect} />;
            case Stage.BlogCreation:
                 if (!selectedSeedKeyword || !expansionData || !selectedExpansionDetails) return null;
                 return <Stage4 
                    blogPost={blogPost}
                    onGenerate={handleBlogGeneration} 
                    mainKeyword={selectedSeedKeyword.keyword}
                    details={expansionData}
                    selection={selectedExpansionDetails}
                 />;
            default:
                return <Stage1 onNicheSubmit={handleNicheSubmit} keywords={mainKeywords} onKeywordSelect={handleMainKeywordSelect} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header onReset={handleReset} />
                <main className="mt-8">
                    <StepIndicator currentStage={stage} />
                    <div className="mt-8 p-6 sm:p-8 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700">
                        {renderStage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
