"use client";

import { type FormEvent, useState } from "react";

/**
 * GitHub username rules: alphanumeric + single hyphens, 1-39 chars,
 * cannot start or end with a hyphen.
 */
const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

interface SearchFormProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError("PLEASE ENTER A GITHUB USERNAME.");
      return;
    }

    if (!USERNAME_REGEX.test(trimmed)) {
      setError("INVALID USERNAME -- USE LETTERS, NUMBERS, AND HYPHENS ONLY.");
      return;
    }

    setError(null);
    onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="GitHub user lookup" className="w-full max-w-md mx-auto">
      <p className="text-[10px] font-mono tracking-[0.1em] text-muted mb-2 uppercase">
        [ USER LOOKUP ]
      </p>
      <div className="flex gap-[1px]">
        <label htmlFor="github-username" className="sr-only">
          GitHub username
        </label>
        <input
          id="github-username"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. octocat"
          disabled={isLoading}
          aria-label="GitHub username"
          aria-describedby={error ? "search-error" : undefined}
          aria-invalid={error ? true : undefined}
          className="flex-1 h-11 px-4 bg-surface text-foreground font-mono text-sm uppercase tracking-[0.05em] border border-foreground rounded-none placeholder:text-muted placeholder:normal-case focus:outline-none focus:border-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 px-5 bg-background text-foreground font-mono text-xs uppercase tracking-[0.1em] border border-foreground rounded-none hover:bg-accent hover:text-background transition-colors disabled:opacity-50"
        >
          {isLoading ? ">>>" : ">>> EXECUTE"}
        </button>
      </div>
      {error && (
        <p id="search-error" role="alert" className="mt-2 text-[11px] font-mono tracking-[0.05em] text-accent uppercase">
          {`/// ${error}`}
        </p>
      )}
    </form>
  );
}
