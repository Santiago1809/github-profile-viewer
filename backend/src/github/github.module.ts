import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubHttpClient } from './github-http.client';
import { LruCacheService } from './cache/lru-cache.service';

@Module({
  controllers: [GithubController],
  providers: [GithubService, GithubHttpClient, LruCacheService],
  exports: [LruCacheService],
})
export class GithubModule {}
