import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './routes/App';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Dashboard from './routes/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

import '@fontsource/pacifico';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { 
    path: '/login', 
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ) 
  },
  { 
    path: '/signup', 
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ) 
  },
  { 
    path: '/dashboard', 
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ) 
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #ef4444',
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
);

