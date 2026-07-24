import type { GithubProfile } from "../_types/github-profile";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchProfile(
  username: string,
): Promise<GithubProfile> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Create a .env.local file with NEXT_PUBLIC_API_URL set to the backend URL.",
    );
  }

  const url = `${baseUrl.replace(/\/+$/, "")}/user/${encodeURIComponent(username)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || "Unknown error");
  }

  return res.json() as Promise<GithubProfile>;
}
