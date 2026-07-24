import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { GithubProfileDto } from '../dto/github-profile.dto';

@Injectable()
export class LruCacheService {
  private cache: LRUCache<string, GithubProfileDto>;

  constructor() {
    this.cache = new LRUCache<string, GithubProfileDto>({
      max: 100,
      ttl: 60_000,
    });
  }

  get(key: string): GithubProfileDto | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: GithubProfileDto): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}
