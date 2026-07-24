"use client";

export default function EmptyState() {
  return (
    <div
      className="relative flex flex-col items-center justify-center py-24 px-4 overflow-hidden"
      role="status"
    >
      {/* Crosshair decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-crosshair">
        <div className="relative w-48 h-48">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground/20 -translate-x-1/2" />
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground/20 -translate-y-1/2" />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent/30 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Terminal prompt */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="font-mono text-lg text-terminal-green">
          <samp>
            {">"}
            <span className="animate-blink">_</span>
          </samp>
        </p>
        <p className="font-mono text-xs tracking-[0.1em] text-muted uppercase text-center">
          <samp>
            AWAITING INPUT
            <br />
            {"//"} ENTER GITHUB USERNAME
          </samp>
        </p>
      </div>
    </div>
  );
}
