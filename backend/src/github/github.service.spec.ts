import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubHttpClient } from './github-http.client';
import { NotFoundException, HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { GithubProfileDto } from './dto/github-profile.dto';
import { LruCacheService } from './cache/lru-cache.service';

describe('GithubService', () => {
  let service: GithubService;
  let mockClient: { get: jest.Mock };
  let mockCacheService: Partial<LruCacheService>;

  const dtoProfile: GithubProfileDto = {
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    login: 'octocat',
    name: 'The Octocat',
    bio: 'Example bio',
    public_repos: 8,
    followers: 9000,
    following: 9,
    location: 'San Francisco',
    blog: null,
    html_url: 'https://github.com/octocat',
  };

  beforeEach(async () => {
    mockClient = { get: jest.fn() };
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: GithubHttpClient,
          useValue: { client: mockClient },
        },
        {
          provide: LruCacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProfile', () => {
    const mockApiResponse = {
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
      login: 'octocat',
      name: 'The Octocat',
      bio: 'Example bio',
      public_repos: 8,
      followers: 9000,
      following: 9,
      location: 'San Francisco',
      blog: '',
      html_url: 'https://github.com/octocat',
      node_id: 'MDQ6VXNlcjU4MzIzMQ==',
      gravatar_id: '',
      company: '@github',
    };

    it('should fetch and return a transformed GithubProfileDto', async () => {
      mockClient.get.mockResolvedValue({ data: mockApiResponse });

      const result = await service.fetchProfile('octocat');

      expect(result).toBeInstanceOf(GithubProfileDto);
      expect(result.login).toBe('octocat');
      expect(result.name).toBe('The Octocat');
      expect(result.bio).toBe('Example bio');
      expect(result.public_repos).toBe(8);
      expect(result.followers).toBe(9000);
      expect(result.following).toBe(9);
      expect(result.location).toBe('San Francisco');
      expect(result.html_url).toBe('https://github.com/octocat');
      expect(mockClient.get).toHaveBeenCalledWith('/users/octocat');
    });

    it('should normalize empty blog string to null', async () => {
      mockClient.get.mockResolvedValue({ data: mockApiResponse });

      const result = await service.fetchProfile('octocat');

      expect(result.blog).toBeNull();
    });

    it('should keep non-empty blog value as-is', async () => {
      mockClient.get.mockResolvedValue({
        data: { ...mockApiResponse, blog: 'https://example.com' },
      });

      const result = await service.fetchProfile('octocat');

      expect(result.blog).toBe('https://example.com');
    });

    it('should exclude extraneous fields not in DTO', async () => {
      mockClient.get.mockResolvedValue({ data: mockApiResponse });

      const result = await service.fetchProfile('octocat');

      expect(result).not.toHaveProperty('node_id');
      expect(result).not.toHaveProperty('gravatar_id');
      expect(result).not.toHaveProperty('company');
    });

    it('should throw NotFoundException when GitHub returns 404', async () => {
      const error = new AxiosError(
        'Not Found',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        { status: 404, data: { message: 'Not Found' } } as any,
      );
      mockClient.get.mockRejectedValue(error);

      await expect(service.fetchProfile('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException(429) when GitHub returns 403 (rate limit)', async () => {
      const error = new AxiosError(
        'Forbidden',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        { status: 403, data: { message: 'Rate limit' } } as any,
      );
      mockClient.get.mockRejectedValue(error);

      await expect(service.fetchProfile('test')).rejects.toThrow(HttpException);
    });

    it('should throw HttpException(429) when GitHub returns 429', async () => {
      const error = new AxiosError(
        'Too Many Requests',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        { status: 429, data: { message: 'Rate limit' } } as any,
      );
      mockClient.get.mockRejectedValue(error);

      await expect(service.fetchProfile('test')).rejects.toThrow(HttpException);
    });
  });

  describe('cache integration', () => {
    beforeEach(() => {
      // Reset mock calls and ensure cache mock returns undefined by default
      jest.clearAllMocks();
      (mockCacheService.get as jest.Mock).mockReturnValue(undefined);
      (mockCacheService.has as jest.Mock).mockReturnValue(false);
    });

    it('should return cached profile when available, without calling HTTP', async () => {
      (mockCacheService.has as jest.Mock).mockReturnValue(true);
      (mockCacheService.get as jest.Mock).mockReturnValue(dtoProfile);

      const result = await service.fetchProfile('octocat');

      expect(result).toEqual(dtoProfile);
      expect(mockCacheService.has).toHaveBeenCalledWith('octocat');
      expect(mockCacheService.get).toHaveBeenCalledWith('octocat');
      expect(mockClient.get).not.toHaveBeenCalled();
    });

    it('should call HTTP and cache result on cache miss', async () => {
      const mockApiResponse = {
        avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
        login: 'octocat',
        name: 'The Octocat',
        bio: 'Example bio',
        public_repos: 8,
        followers: 9000,
        following: 9,
        location: 'San Francisco',
        blog: '',
        html_url: 'https://github.com/octocat',
      };
      mockClient.get.mockResolvedValue({ data: mockApiResponse });

      const result = await service.fetchProfile('octocat');

      expect(result.login).toBe('octocat');
      expect(mockClient.get).toHaveBeenCalledWith('/users/octocat');
      expect(mockCacheService.set).toHaveBeenCalledWith('octocat', result);
    });

    it('should not cache errors', async () => {
      const error = new AxiosError(
        'Not Found',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        { status: 404, data: { message: 'Not Found' } } as any,
      );
      mockClient.get.mockRejectedValue(error);

      await expect(service.fetchProfile('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });
  });
});
