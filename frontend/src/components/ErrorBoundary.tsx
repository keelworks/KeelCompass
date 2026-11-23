import { Component, ErrorInfo, ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "./ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// catches render-time errors anywhere below it so a single broken component
// shows a recoverable screen instead of a blank white page - React only
// supports this via a class component, there's no hook equivalent
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] dark:bg-[#0F1113] px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-50 dark:bg-teal-900/30 flex items-center justify-center">
            <FiAlertTriangle className="text-brand-700 dark:text-teal-300" size={26} />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This page ran into an unexpected error. Reloading usually fixes it.
          </p>
          <Button variant="primary" size="md" className="w-full" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
