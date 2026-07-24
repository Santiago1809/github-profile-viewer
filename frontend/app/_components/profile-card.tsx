"use client";

import type { GithubProfile } from "../_types/github-profile";

interface ProfileCardProps {
  profile: GithubProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const blogUrl = normaliseUrl(profile.blog);

  return (
    <article className="w-full max-w-lg mx-auto border border-border-custom">
      {/* Header */}
      <div className="border-b border-border-custom px-4 py-3 bg-surface">
        <hgroup>
          <p className="text-[10px] font-mono tracking-[0.1em] text-muted uppercase">
            <samp>{`[ PROFILE DATA // UNIT: ${profile.login} ]`}</samp>
          </p>
          <h2 className="macro-header text-[clamp(1.25rem,4vw,2rem)] text-foreground mt-1">
            {profile.name || profile.login}
          </h2>
        </hgroup>
      </div>

      {/* Avatar + Login row */}
      <div className="flex items-start gap-5 px-4 py-5">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar_url}
            alt={`Avatar for ${profile.login}`}
            className="w-20 h-20 border-2 border-foreground rounded-none shrink-0"
          />
        </figure>
        <div className="min-w-0 pt-1">
          <p className="text-sm font-mono text-muted uppercase tracking-[0.05em]">
            <samp>{`@${profile.login}`}</samp>
          </p>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mx-4 mb-4 border border-border-custom p-3">
          <p className="text-[10px] font-mono tracking-[0.1em] text-muted uppercase mb-1">
            <samp>[ BIO ]</samp>
          </p>
          <p className="font-mono text-xs text-foreground leading-relaxed">
            <samp>{profile.bio}</samp>
          </p>
        </div>
      )}

      {/* Stats grid with gap: 1px grid lines */}
      <div className="mx-4 mb-4 grid grid-cols-3 gap-[1px] bg-foreground border border-border-custom">
        <Stat label="REPOS" value={profile.public_repos} />
        <Stat label="FOLLOWERS" value={profile.followers} />
        <Stat label="FOLLOWING" value={profile.following} />
      </div>

      {/* Metadata rows */}
      <dl className="mx-4 mb-4 space-y-3">
        {profile.location && (
          <div className="font-mono text-xs tracking-[0.05em]">
            <dt className="block text-[10px] tracking-[0.1em] text-muted uppercase mb-1">
              <samp>[ LOCATION ]</samp>
            </dt>
            <dd className="text-foreground">
              <samp>{profile.location}</samp>
            </dd>
          </div>
        )}
        {profile.company && (
          <div className="font-mono text-xs tracking-[0.05em]">
            <dt className="block text-[10px] tracking-[0.1em] text-muted uppercase mb-1">
              <samp>[ COMPANY ]</samp>
            </dt>
            <dd className="text-foreground">
              <samp>{profile.company}</samp>
            </dd>
          </div>
        )}
        {profile.email && (
          <div className="font-mono text-xs tracking-[0.05em]">
            <dt className="block text-[10px] tracking-[0.1em] text-muted uppercase mb-1">
              <samp>[ EMAIL ]</samp>
            </dt>
            <dd>
              <samp>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-foreground hover:text-accent underline underline-offset-2 decoration-border-custom transition-colors"
                >
                  {profile.email}
                </a>
              </samp>
            </dd>
          </div>
        )}
        {blogUrl && (
          <div className="font-mono text-xs tracking-[0.05em]">
            <dt className="block text-[10px] tracking-[0.1em] text-muted uppercase mb-1">
              <samp>[ BLOG ]</samp>
            </dt>
            <dd>
              <samp>
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-accent underline underline-offset-2 decoration-border-custom transition-colors"
                >
                  {profile.blog}
                </a>
              </samp>
            </dd>
          </div>
        )}
        {profile.hireable !== null && (
          <div className="font-mono text-xs tracking-[0.05em]">
            <dt className="block text-[10px] tracking-[0.1em] text-muted uppercase mb-1">
              <samp>[ STATUS ]</samp>
            </dt>
            <dd>
              <samp>
                <span className={profile.hireable ? "text-terminal-green" : "text-muted"}>
                  {profile.hireable ? "AVAILABLE FOR HIRE" : "NOT AVAILABLE"}
                </span>
              </samp>
            </dd>
          </div>
        )}
      </dl>

      {/* Action */}
      <hr className="industrial-rule mx-4" />
      <div className="px-4 pb-5">
        <a
          href={profile.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-foreground px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.1em] text-foreground hover:bg-foreground hover:text-background transition-colors rounded-none"
        >
          <samp>[ VIEW SOURCE ]</samp>
        </a>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background p-4 text-center">
      <data value={String(value)} className="block text-2xl font-bold font-mono text-foreground">
        {value}
      </data>
      <span className="block text-[10px] font-mono tracking-[0.1em] text-muted uppercase mt-1">
        {label}
      </span>
    </div>
  );
}

function normaliseUrl(url: string | null): string | null {
  if (!url || url.trim() === "") return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
