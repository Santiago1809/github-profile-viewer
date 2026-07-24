"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../_lib/api";
import type { GithubProfile } from "../_types/github-profile";
import SearchForm from "./search-form";
import ProfileCard from "./profile-card";
import EmptyState from "./empty-state";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";

export default function GithubProfileViewer() {
  const [username, setUsername] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery<GithubProfile>({
    queryKey: ["github-profile", username],
    queryFn: () => fetchProfile(username!),
    enabled: username !== null,
    retry: false,
    staleTime: 60000,
  });

  const isIdle = username === null;

  const handleSearch = useCallback((name: string) => {
    setUsername(name);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      {/* System header */}
      <header className="w-full max-w-lg">
        <h1 className="macro-header text-[clamp(1.5rem,5vw,2.5rem)] text-foreground">
          GITHUB PROFILE
        </h1>
        <hr className="industrial-rule mt-2 mb-1" />
        <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
          <samp>{">>> CLASSIFIED DATA RETRIEVAL SYSTEM"}</samp>
        </p>
      </header>

      {/* Search form */}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* Content area */}
      <div className="w-full max-w-lg">
        {isIdle && <EmptyState />}

        {isLoading && <LoadingState />}

        {isError && error instanceof Error && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}

        {isSuccess && data && <ProfileCard profile={data} />}
      </div>
    </div>
  );
}
