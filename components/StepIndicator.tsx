
import React from 'react';
import { Stage } from '../../types';

interface StepIndicatorProps {
    currentStage: Stage;
}

const steps = [
    { id: Stage.MainKeywords, title: 'Main Keywords' },
    { id: Stage.SeedKeywords, title: 'Seed Keywords' },
    { id: Stage.KeywordExpansion, title: 'Expand Topic' },
    { id: Stage.BlogCreation, title: 'Create Blog' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStage }) => {
    return (
        <div className="w-full">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isActive = currentStage >= step.id;
                    const isCurrent = currentStage === step.id;
                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                                        isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-indigo-500/50' : ''}`}
                                >
                                    {step.id}
                                </div>
                                <p className={`mt-2 text-xs sm:text-sm text-center font-semibold ${isActive ? 'text-indigo-300' : 'text-gray-500'}`}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${isActive ? 'bg-indigo-600' : 'bg-gray-700'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
