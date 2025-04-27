import React from 'react';
import { Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Separate component to use hooks
function ErrorFallback({ error }) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20">
      <Alert color="failure">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-medium mb-2">Something went wrong</h2>
          <p className="text-center">{error?.message || 'An unknown error occurred'}</p>
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </Alert>
    </div>
  );
}

export default ErrorBoundary;