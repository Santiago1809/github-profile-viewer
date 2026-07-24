"use client";

export default function LoadingState() {
  return (
    <div className="w-full max-w-lg mx-auto" role="status" aria-label="Loading profile">
      {/* Header */}
      <div className="border border-border-custom p-4">
        <p className="text-[10px] font-mono tracking-[0.1em] text-muted uppercase">
          <samp>{`[ FETCHING DATA... ]`}</samp>
        </p>
      </div>

      <hr className="industrial-rule" />

      {/* Loading bar */}
      <div className="border border-border-custom p-4">
        <div className="w-full h-4 bg-surface border border-border-custom rounded-none overflow-hidden">
          <div className="h-full bg-foreground animate-loading-bar rounded-none" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-3 bg-surface w-3/4" />
          <div className="h-3 bg-surface w-1/2" />
          <div className="h-3 bg-surface w-5/6" />
        </div>
      </div>

      <hr className="industrial-rule" />

      {/* Status line */}
      <div className="border border-border-custom p-3">
        <p className="font-mono text-[11px] tracking-[0.05em] text-muted uppercase text-center">
          <samp>{">>> PROCESSING REQUEST"}</samp>
        </p>
      </div>
    </div>
  );
}
