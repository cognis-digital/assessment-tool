import { useState } from 'react';
import { Shield, Brain, Database } from 'lucide-react';

interface ResultsProps {
  scores: {
    technology: number;
    security: number;
    analytics: number;
  };
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'technology':
      return <Database className="w-6 h-6" />;
    case 'security':
      return <Shield className="w-6 h-6" />;
    case 'analytics':
      return <Brain className="w-6 h-6" />;
    default:
      return null;
  }
};

export function AssessmentResults({ scores }: ResultsProps) {
  const [showPaymentUI, setShowPaymentUI] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRecommendation = (score: number) => {
    if (score >= 80) {
      return 'Excellent! Keep maintaining these high standards.';
    }
    if (score >= 60) {
      return 'Good progress, but there\'s room for improvement.';
    }
    if (score >= 40) {
      return 'Consider prioritizing improvements in this area.';
    }
    return 'Immediate attention required. Focus on building foundational capabilities.';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Assessment Results</h1>
      
      <div className="grid gap-6 mb-8">
        {Object.entries(scores).map(([category, score]) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              {getCategoryIcon(category)}
              <h2 className="text-xl font-semibold capitalize">{category}</h2>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
            </div>
            <p className="text-gray-600">
              {getRecommendation(score)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowPaymentUI(true)}
          className="bg-royal text-white px-6 py-3 rounded-lg hover:bg-royal-dark transition-colors"
        >
          Get Detailed Report
        </button>
      </div>

      {showPaymentUI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Get Your Detailed Report</h3>
            <p className="text-gray-600 mb-6">
              Unlock a comprehensive analysis of your assessment results with actionable insights
              and detailed recommendations.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPaymentUI(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                className="bg-royal text-white px-6 py-2 rounded-lg hover:bg-royal-dark transition-colors"
                onClick={() => {
                  // TODO: Implement payment flow
                  console.log('Processing payment...');
                }}
              >
                Purchase ($49)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}