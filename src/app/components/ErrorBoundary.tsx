'use client';

import {
  Component,
  captureOwnerStack,
  type ErrorInfo,
  type ReactNode,
} from 'react';

class ErrorBoundary extends Component<
  {
    children: ReactNode;
    fallback: ReactNode;
    onError?: (error: unknown, info: ErrorInfo, stack?: string | null) => void;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError?.(error, info, captureOwnerStack());
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
