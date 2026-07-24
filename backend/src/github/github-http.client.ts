import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class GithubHttpClient {
  public readonly client: AxiosInstance;

  constructor() {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers,
    });
  }
}
