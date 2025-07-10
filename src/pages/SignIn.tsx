import { SignIn } from "@clerk/clerk-react";

export function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-royal to-royal-dark flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Digital Maturity Assessment</h1>
          <p className="text-white/80">Sign in to start your assessment</p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            afterSignInUrl="/welcome"
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-royal hover:bg-royal-dark text-sm normal-case",
                card: "bg-transparent shadow-none",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: 
                  "border border-gray-300 hover:bg-gray-50",
                formFieldInput: 
                  "border-gray-300 focus:ring-royal focus:border-royal",
                footer: "hidden"
              },
            }}
          />
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
            <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm opacity-80">Get intelligent insights about your digital maturity</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
            <h3 className="font-semibold mb-2">Secure & Confidential</h3>
            <p className="text-sm opacity-80">Enterprise-grade security for your data</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
            <h3 className="font-semibold mb-2">Comprehensive Report</h3>
            <p className="text-sm opacity-80">Get detailed recommendations and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
