import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { Assessment } from './pages/Assessment';
import { AssessmentResults } from './pages/AssessmentResults';
import { SignInPage } from './pages/SignIn';
import { SignUpPage } from './pages/SignUp';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

function App() {
  return (
    <Router>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <Routes>
          {/* Root route redirects based on auth status */}
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Welcome />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />

          {/* Auth routes - redirect to welcome if already signed in */}
          <Route
            path="/sign-in"
            element={
              <>
                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
                <SignedOut>
                  <SignInPage />
                </SignedOut>
              </>
            }
          />
          
          <Route
            path="/sign-up"
            element={
              <>
                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
                <SignedOut>
                  <SignUpPage />
                </SignedOut>
              </>
            }
          />

          {/* Protected routes - must be signed in */}
          <Route
            path="/assessment"
            element={
              <>
                <SignedIn>
                  <Assessment />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />
          
          <Route
            path="/assessment-results"
            element={
              <>
                <SignedIn>
                  <AssessmentResults />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ClerkProvider>
    </Router>
  );
}

export default App;