import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type CompanyInfo = {
  industry: string;
  reportName: string;
  employeeCount: string;
}

type Question = {
  id: number;
  category: 'technology' | 'security' | 'analytics';
  text: string;
  options: {
    text: string;
    score: number;
  }[];
}

type Step = {
  id: number;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Company Information",
    description: "Tell us about your organization"
  },
  {
    id: 2,
    title: "Technology Infrastructure",
    description: "Evaluate your current technology stack"
  },
  {
    id: 3,
    title: "Security & Compliance",
    description: "Assess your security measures"
  },
  {
    id: 4,
    title: "Data & Analytics",
    description: "Review your data capabilities"
  },
  {
    id: 5,
    title: "Review & Submit",
    description: "Review your answers and submit"
  }
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Other'
];

const EMPLOYEE_RANGES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
];

const QUESTIONS: Question[] = [
  // Technology Questions (Step 2)
  {
    id: 1,
    category: 'technology',
    text: "How would you rate your organization's cloud infrastructure adoption?",
    options: [
      { text: 'No cloud infrastructure', score: 0 },
      { text: 'Basic cloud storage only', score: 25 },
      { text: 'Partial cloud adoption', score: 50 },
      { text: 'Mostly cloud-based', score: 75 },
      { text: 'Fully cloud-native', score: 100 }
    ]
  },
  {
    id: 2,
    category: 'technology',
    text: "What is the state of your application modernization efforts?",
    options: [
      { text: 'All legacy applications', score: 0 },
      { text: 'Beginning to modernize', score: 25 },
      { text: 'Mix of legacy and modern', score: 50 },
      { text: 'Mostly modern applications', score: 75 },
      { text: 'Fully modernized architecture', score: 100 }
    ]
  },
  {
    id: 3,
    category: 'technology',
    text: "How automated are your development and deployment processes?",
    options: [
      { text: 'Manual processes', score: 0 },
      { text: 'Basic automation', score: 25 },
      { text: 'Partial CI/CD', score: 50 },
      { text: 'Advanced CI/CD', score: 75 },
      { text: 'Fully automated DevOps', score: 100 }
    ]
  },
  {
    id: 4,
    category: 'technology',
    text: "How would you describe your API strategy?",
    options: [
      { text: 'No APIs', score: 0 },
      { text: 'Basic internal APIs', score: 25 },
      { text: 'Some API integration', score: 50 },
      { text: 'API-first approach', score: 75 },
      { text: 'Full API ecosystem', score: 100 }
    ]
  },
  {
    id: 5,
    category: 'technology',
    text: "What is your approach to infrastructure scalability?",
    options: [
      { text: 'Fixed infrastructure', score: 0 },
      { text: 'Manual scaling', score: 25 },
      { text: 'Some auto-scaling', score: 50 },
      { text: 'Advanced auto-scaling', score: 75 },
      { text: 'Serverless architecture', score: 100 }
    ]
  },
  // Security Questions (Step 3)
  {
    id: 6,
    category: 'security',
    text: "How comprehensive is your security testing program?",
    options: [
      { text: 'No security testing', score: 0 },
      { text: 'Basic vulnerability scans', score: 25 },
      { text: 'Regular penetration testing', score: 50 },
      { text: 'Continuous security testing', score: 75 },
      { text: 'Full SecOps integration', score: 100 }
    ]
  },
  {
    id: 7,
    category: 'security',
    text: "What is your approach to identity and access management?",
    options: [
      { text: 'Basic password protection', score: 0 },
      { text: 'Standard authentication', score: 25 },
      { text: 'MFA implementation', score: 50 },
      { text: 'SSO integration', score: 75 },
      { text: 'Zero trust architecture', score: 100 }
    ]
  },
  {
    id: 8,
    category: 'security',
    text: "How do you handle data encryption?",
    options: [
      { text: 'No encryption', score: 0 },
      { text: 'Basic data encryption', score: 25 },
      { text: 'Transport layer security', score: 50 },
      { text: 'End-to-end encryption', score: 75 },
      { text: 'Full encryption lifecycle', score: 100 }
    ]
  },
  {
    id: 9,
    category: 'security',
    text: "What is your incident response capability?",
    options: [
      { text: 'No formal process', score: 0 },
      { text: 'Basic incident handling', score: 25 },
      { text: 'Documented procedures', score: 50 },
      { text: 'Automated detection', score: 75 },
      { text: 'Full SOC integration', score: 100 }
    ]
  },
  {
    id: 10,
    category: 'security',
    text: "How do you manage compliance requirements?",
    options: [
      { text: 'No compliance program', score: 0 },
      { text: 'Basic compliance', score: 25 },
      { text: 'Regular audits', score: 50 },
      { text: 'Continuous monitoring', score: 75 },
      { text: 'Automated compliance', score: 100 }
    ]
  },
  // Analytics Questions (Step 4)
  {
    id: 11,
    category: 'analytics',
    text: "How would you describe your data analytics capabilities?",
    options: [
      { text: 'No analytics', score: 0 },
      { text: 'Basic reporting', score: 25 },
      { text: 'Business intelligence', score: 50 },
      { text: 'Advanced analytics', score: 75 },
      { text: 'AI/ML integration', score: 100 }
    ]
  },
  {
    id: 12,
    category: 'analytics',
    text: "What is your approach to data governance?",
    options: [
      { text: 'No governance', score: 0 },
      { text: 'Basic policies', score: 25 },
      { text: 'Defined standards', score: 50 },
      { text: 'Active governance', score: 75 },
      { text: 'Automated governance', score: 100 }
    ]
  },
  {
    id: 13,
    category: 'analytics',
    text: "How do you handle data integration?",
    options: [
      { text: 'Manual data entry', score: 0 },
      { text: 'Basic integration', score: 25 },
      { text: 'Multiple data sources', score: 50 },
      { text: 'Real-time integration', score: 75 },
      { text: 'Full data ecosystem', score: 100 }
    ]
  },
  {
    id: 14,
    category: 'analytics',
    text: "What is your data visualization capability?",
    options: [
      { text: 'Basic spreadsheets', score: 0 },
      { text: 'Static reports', score: 25 },
      { text: 'Interactive dashboards', score: 50 },
      { text: 'Advanced visualizations', score: 75 },
      { text: 'Real-time analytics', score: 100 }
    ]
  },
  {
    id: 15,
    category: 'analytics',
    text: "How do you leverage predictive analytics?",
    options: [
      { text: 'No predictive analytics', score: 0 },
      { text: 'Basic forecasting', score: 25 },
      { text: 'Statistical modeling', score: 50 },
      { text: 'Machine learning', score: 75 },
      { text: 'Advanced AI models', score: 100 }
    ]
  }
];

export function Assessment() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    industry: '',
    reportName: '',
    employeeCount: ''
  });
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!user) {
    navigate('/sign-in');
    return null;
  }

  const getCurrentQuestions = () => {
    if (currentStep === 2) {
      return QUESTIONS.filter(q => q.category === 'technology');
    }
    if (currentStep === 3) {
      return QUESTIONS.filter(q => q.category === 'security');
    }
    if (currentStep === 4) {
      return QUESTIONS.filter(q => q.category === 'analytics');
    }
    return [];
  };

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const isStepComplete = () => {
    if (currentStep === 1) {
      return companyInfo.industry && companyInfo.reportName && companyInfo.employeeCount;
    }
    
    const questions = getCurrentQuestions();
    return questions.every(q => answers[q.id] !== undefined);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Calculate scores by category
      const scores = {
        technology: 0,
        security: 0,
        analytics: 0
      };

      Object.entries(answers).forEach(([questionId, score]) => {
        const question = QUESTIONS.find(q => q.id === parseInt(questionId));
        if (question) {
          scores[question.category] += score;
        }
      });

      // Average the scores
      Object.keys(scores).forEach(key => {
        scores[key as keyof typeof scores] = Math.round(
          scores[key as keyof typeof scores] / 5
        );
      });

      // Navigate to results with all data
      navigate('/assessment-results', {
        state: {
          scores,
          companyInfo,
          answers,
          questions: QUESTIONS
        }
      });
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex-1 relative ${
                  step.id !== STEPS.length ? 'after:content-[""] after:h-1 after:w-full after:absolute after:top-4 after:left-1/2 after:bg-gray-200' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                      step.id === currentStep
                        ? 'bg-royal text-white'
                        : step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="mt-2 text-sm text-center">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{STEPS[currentStep - 1].title}</h2>
          <p className="text-gray-600 mb-6">{STEPS[currentStep - 1].description}</p>

          {currentStep === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={companyInfo.reportName}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, reportName: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Q1 2025 Assessment"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={companyInfo.industry}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees
                </label>
                <select
                  value={companyInfo.employeeCount}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, employeeCount: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Range</option>
                  {EMPLOYEE_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : currentStep < 5 ? (
            <div className="space-y-8">
              {getCurrentQuestions().map((question) => (
                <div key={question.id} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">{question.text}</h3>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === option.score}
                          onChange={() => handleAnswer(question.id, option.score)}
                          className="mr-3"
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Report Name:</span>
                    <p className="font-medium">{companyInfo.reportName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Industry:</span>
                    <p className="font-medium">{companyInfo.industry}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Employees:</span>
                    <p className="font-medium">{companyInfo.employeeCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Assessment Summary</h3>
                <div className="space-y-4">
                  {['technology', 'security', 'analytics'].map((category) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <span className="font-medium">
                        {QUESTIONS.filter(q => q.category === category).every(
                          q => answers[q.id] !== undefined
                        )
                          ? 'Complete'
                          : 'Incomplete'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center px-6 py-3 ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <button
            onClick={currentStep === 5 ? handleSubmit : handleNext}
            disabled={!isStepComplete() || loading}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isStepComplete()
                ? 'bg-royal text-white hover:bg-royal-dark'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              'Processing...'
            ) : currentStep === 5 ? (
              'Submit Assessment'
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}