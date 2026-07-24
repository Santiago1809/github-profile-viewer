"use client";

import { ApiError } from "../_lib/api";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

function userFriendlyMessage(error: Error): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 404:
        return "USER NOT FOUND";
      case 429:
        return "RATE LIMIT EXCEEDED. TRY AGAIN LATER.";
      case 403:
        return "ACCESS DENIED. REQUEST REFUSED.";
      default:
        if (error.status >= 500) {
          return "SERVER ERROR. TRY AGAIN LATER.";
        }
        return (error.message || `REQUEST FAILED (${error.status})`).toUpperCase();
    }
  }

  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "CONNECTION ERROR. CHECK INTERNET.";
  }

  return (error.message || "UNEXPECTED ERROR.").toUpperCase();
}

function errorCode(error: Error): string {
  if (error instanceof ApiError) {
    return String(error.status);
  }
  return "SYSTEM";
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = userFriendlyMessage(error);
  const code = errorCode(error);

  return (
    <div
      className="w-full max-w-lg mx-auto border-l-2 border-accent pl-4"
      role="alert"
    >
      {/* Error frame header */}
      <div className="border border-border-custom p-3">
        <p className="text-[10px] font-mono tracking-[0.1em] text-accent uppercase">
          <samp>{`[ ERROR // ${code} ]`}</samp>
        </p>
      </div>

      <hr className="industrial-rule" />

      {/* Message */}
      <div className="border border-border-custom p-3">
        <p className="font-mono text-xs tracking-[0.05em] text-foreground">
          <samp>{message}</samp>
        </p>
      </div>

      <hr className="industrial-rule" />

      {/* Retry */}
      {onRetry && (
        <div className="text-center">
          <button
            type="button"
            onClick={onRetry}
            className="border border-foreground px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-foreground bg-background hover:bg-foreground hover:text-background transition-colors rounded-none"
          >
            <samp>[ RETRY ]</samp>
          </button>
        </div>
      )}
    </div>
  );
}
