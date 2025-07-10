import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, FileText, Star } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const credits = 3; // TODO: Implement credits system
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: assessmentData } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (assessmentData) {
        setAssessments(assessmentData);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <button
            onClick={() => navigate('/sign-in')}
            className="bg-royal text-white px-6 py-3 rounded-lg hover:bg-royal-dark transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.firstName}</h1>
              <p className="text-gray-600 mt-1">Let's assess your organization's digital maturity</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-royal" />
                <span className="font-medium">{credits} Credits</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8">
            {/* Start Assessment Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Digital Maturity Assessment</h2>
                  <p className="text-gray-600">
                    Evaluate your organization's digital capabilities and get personalized recommendations
                  </p>
                </div>
                <button
                  onClick={() => navigate('/assessment')}
                  className="bg-royal text-white px-6 py-3 rounded-lg hover:bg-royal-dark transition-colors flex items-center space-x-2"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">25 Questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">Comprehensive Report</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">1 Credit Required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Assessments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Previous Assessments</h2>
              {assessments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Complete your first assessment to see your results here</p>
                  <button
                    onClick={() => navigate('/assessment')}
                    className="bg-royal text-white px-6 py-3 rounded-lg hover:bg-royal-dark transition-colors"
                  >
                    Start Your First Assessment
                  </button>
                </div>
              ) : (
                assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 hover:border-royal transition-colors mb-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-neutral-900">{assessment.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        assessment.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    
                    {assessment.score !== null && (
                      <div className="mb-4">
                        <div className="text-sm text-neutral-600 mb-1">Overall Score</div>
                        <div className="text-2xl font-bold text-royal">{assessment.score}%</div>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-neutral-500">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => navigate(`/assessment/${assessment.id}`)}
                        className="text-royal hover:text-royal-dark flex items-center space-x-2 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}