import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { plainToInstance } from 'class-transformer';
import { GithubHttpClient } from './github-http.client';
import { GithubProfileDto } from './dto/github-profile.dto';
import { LruCacheService } from './cache/lru-cache.service';

@Injectable()
export class GithubService {
  constructor(
    private readonly githubHttpClient: GithubHttpClient,
    private readonly cacheService: LruCacheService,
  ) {}

  async fetchProfile(username: string): Promise<GithubProfileDto> {
    if (this.cacheService.has(username)) {
      return this.cacheService.get(username) as GithubProfileDto;
    }

    try {
      const response = await this.githubHttpClient.client.get(
        `/users/${username}`,
      );
      const profile = plainToInstance(GithubProfileDto, response.data, {
        excludeExtraneousValues: true,
      });
      this.cacheService.set(username, profile);
      return profile;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          throw new NotFoundException(`User '${username}' not found`);
        }
        if (status === 403 || status === 429) {
          throw new HttpException('GitHub rate limit exceeded', 429);
        }
      }
      throw error;
    }
  }
}
