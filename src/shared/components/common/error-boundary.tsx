"use client";

import { Component } from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-[15px] font-['DM_Sans'] text-[#8A8A95]">
              Something went wrong.
            </p>
            <button
              type="button"
              className="text-[13px] font-['DM_Sans'] text-[#F0EDE8] underline"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
