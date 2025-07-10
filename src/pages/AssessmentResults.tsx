import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { loadStripe } from '@stripe/stripe-js';
import { Download, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Types
interface AssessmentScores {
  Technology: number;
  Security: number;
  Analytics: number;
}

interface PackageDetails {
  id: string;
  name: string;
  price: number;
  description: string;
  timeline: string;
  process: string[];
  bestFor: string;
}

interface IAssessmentResults {
  scores: AssessmentScores;
  companyInfo: {
    reportName: string;
    industry: string;
    employeeCount: number;
  };
  answers: Record<string, number>;
  questions: {
    id: string;
    category: string;
    text: string;
    options: {
      score: number;
      text: string;
    }[];
  }[];
}

const PACKAGES: Record<string, PackageDetails> = {
  basic: {
    id: 'basic',
    name: 'Basic Package',
    price: 499,
    description: 'Essential digital transformation tools and guidance',
    timeline: '2-4 weeks',
    process: [
      'Initial consultation within 48 hours',
      'Assessment review and roadmap creation: 1 week',
      'Implementation guidance: 2-3 weeks',
    ],
    bestFor: 'Organizations starting their digital transformation journey'
  },
  pro: {
    id: 'pro',
    name: 'Professional Package',
    price: 999,
    description: 'Advanced features and dedicated consultation',
    timeline: '4-8 weeks',
    process: [
      'Priority consultation within 24 hours',
      'Comprehensive assessment review: 1 week',
      'Detailed roadmap and strategy: 1-2 weeks',
      'Implementation support: 2-5 weeks',
    ],
    bestFor: 'Growing organizations ready to accelerate their digital capabilities'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Package',
    price: 1999,
    description: 'Full-scale transformation support and implementation',
    timeline: '8-12 weeks',
    process: [
      'Immediate priority consultation',
      'Executive team assessment review: 1 week',
      'Comprehensive strategy development: 2-3 weeks',
      'Full implementation support: 4-8 weeks',
    ],
    bestFor: 'Large organizations seeking comprehensive digital transformation'
  }
};

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  scorecard: { marginBottom: 15 },
  package: { marginTop: 10, padding: 10, backgroundColor: '#f0f0f0' },
  subheading: { fontSize: 14, marginBottom: 5 },
  bulletPoint: { fontSize: 12, marginBottom: 2 }
});

interface PDFProps {
  results: IAssessmentResults;
  selectedPackages: PackageDetails[];
}

const AssessmentPDF: React.FC<PDFProps> = ({ results, selectedPackages }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Digital Maturity Assessment Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Executive Summary</Text>
        <Text style={styles.text}>
          Assessment results for {results.companyInfo.reportName}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Scores</Text>
        {Object.entries(results.scores).map(([category, score]) => (
          <View key={category} style={styles.scorecard}>
            <Text style={styles.subheading}>{category}</Text>
            <Text style={styles.text}>Score: {score}/100</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Selected Packages</Text>
        {selectedPackages.map((pkg) => (
          <View key={pkg.id} style={styles.package}>
            <Text style={styles.subheading}>{pkg.name}</Text>
            <Text style={styles.text}>Price: ${pkg.price}</Text>
            <Text style={styles.text}>Timeline: {pkg.timeline}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export function AssessmentResults() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [assessmentData, setAssessmentData] = useState<IAssessmentResults | null>(null);

  useEffect(() => {
    if (location.state) {
      setAssessmentData(location.state as IAssessmentResults);
    } else {
      navigate('/assessment');
    }
  }, [location.state, navigate]);

  const renderPDFDownload = () => {
    if (!assessmentData) return null;

    const selectedPackageDetails = Object.values(PACKAGES)
      .filter(pkg => selectedPackages.includes(pkg.id));

    return (
      <PDFDownloadLink
        document={
          <AssessmentPDF
            results={assessmentData}
            selectedPackages={selectedPackageDetails}
          />
        }
        fileName="digital-maturity-assessment.pdf"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal hover:bg-royal-dark"
      >
        {({ loading: pdfLoading }: { loading: boolean }) => (
          <div className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            {pdfLoading ? 'Generating PDF...' : 'Export Report'}
          </div>
        )}
      </PDFDownloadLink>
    );
  };

  const handleCheckout = async () => {
    if (!user || !assessmentData) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packages: selectedPackages,
          userId: user.id,
          assessmentData // Include assessment data in checkout
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { id: sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading assessment results...</h2>
          <p className="text-gray-600">Please wait while we process your results.</p>
        </div>
      </div>
    );
  }

  const { scores } = assessmentData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header with back button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/assessment')}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assessment
            </button>
          
            <div className="flex items-center space-x-4">
              {renderPDFDownload()}

              <button
                onClick={handleCheckout}
                disabled={selectedPackages.length === 0 || loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  selectedPackages.length > 0 && !loading
                    ? 'bg-royal hover:bg-royal-dark'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>

          {/* Results Content */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Assessment Results</h1>
            <div className="grid gap-4">
              {Object.entries(scores).map(([category, score]) => (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <div className="mt-2 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${score}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-royal"
                      />
                    </div>
                    <span className="text-sm text-gray-600 mt-1">{score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Recommended Solutions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(PACKAGES).map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
                    selectedPackages.includes(pkg.id)
                      ? 'border-royal'
                      : 'border-transparent'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                  <p className="text-sm text-gray-600 mb-2">Timeline: {pkg.timeline}</p>
                  <div className="text-2xl font-bold text-gray-900 mb-4">
                    ${pkg.price.toLocaleString()}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.process.map((step, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 bg-royal rounded-full mr-2" />
                        {step}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setSelectedPackages(prev =>
                      prev.includes(pkg.id)
                        ? prev.filter(id => id !== pkg.id)
                        : [...prev, pkg.id]
                    )}
                    className={`w-full py-2 px-4 rounded-md ${
                      selectedPackages.includes(pkg.id)
                        ? 'bg-royal text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPackages.includes(pkg.id) ? 'Selected' : 'Select Package'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}