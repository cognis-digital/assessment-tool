import { useUser, SignedIn } from '@clerk/clerk-react';
import { Brain, Shield, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const displayName = user?.firstName || user?.username || 'there';

  return (
    <SignedIn>
      <div className="min-h-screen bg-gradient-to-br from-royal to-royal-dark">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center text-white mb-16">
              <h1 className="text-5xl font-bold mb-6">
                Welcome, {displayName}!
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Ready to evaluate your organization's digital maturity and get personalized recommendations?
              </p>
            </div>

            {/* Action Section */}
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mb-16">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Your Assessment</h2>
                <p className="text-gray-600 mb-6">
                  Take our comprehensive assessment to understand your organization's strengths and areas for improvement
                </p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="w-full bg-royal text-white px-6 py-3 rounded-lg hover:bg-royal-dark transition-colors"
                >
                  Begin Assessment
                </button>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
                <Brain className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="opacity-80">Get intelligent insights about your organization's digital maturity</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Confidential</h3>
                <p className="opacity-80">Your data is protected with enterprise-grade security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
                <Database className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Comprehensive Report</h3>
                <p className="opacity-80">Receive a detailed report with actionable recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
