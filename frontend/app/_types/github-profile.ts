export interface GithubProfile {
  avatar_url: string;
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  company: string | null;
  email: string | null;
  hireable: boolean | null;
  html_url: string;
}
