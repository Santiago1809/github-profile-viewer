import { Expose, Exclude, Transform } from 'class-transformer';

@Exclude()
export class GithubProfileDto {
  @Expose()
  avatar_url: string;

  @Expose()
  login: string;

  @Expose()
  name: string | null;

  @Expose()
  bio: string | null;

  @Expose()
  public_repos: number;

  @Expose()
  followers: number;

  @Expose()
  following: number;

  @Expose()
  location: string | null;

  @Expose()
  @Transform(({ value }) => (value === '' ? null : value))
  blog: string | null;

  @Expose()
  company: string | null;

  @Expose()
  email: string | null;

  @Expose()
  hireable: boolean | null;

  @Expose()
  html_url: string;
}
