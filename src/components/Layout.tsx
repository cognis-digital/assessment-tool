import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex flex-col h-full">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">Transform.io</span>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => navigate('/assessment')}
                className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <ClipboardList className="w-5 h-5" />
                <span>Assessment</span>
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}