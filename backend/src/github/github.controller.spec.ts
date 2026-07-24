import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubProfileDto } from './dto/github-profile.dto';

describe('GithubController', () => {
  let controller: GithubController;
  let service: jest.Mocked<GithubService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [
        {
          provide: GithubService,
          useValue: {
            fetchProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GithubController>(GithubController);
    service = module.get(GithubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    const mockProfile: GithubProfileDto = {
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
      login: 'octocat',
      name: 'The Octocat',
      bio: null,
      public_repos: 8,
      followers: 9000,
      following: 9,
      location: null,
      blog: null,
      company: null,
      email: null,
      hireable: null,
      html_url: 'https://github.com/octocat',
    };

    it('should return profile for valid username', async () => {
      service.fetchProfile.mockResolvedValue(mockProfile);

      const result = await controller.getUser({ username: 'octocat' });

      expect(result).toEqual(mockProfile);
      expect(service.fetchProfile).toHaveBeenCalledWith('octocat');
    });

    it('should pass the username from params to service', async () => {
      service.fetchProfile.mockResolvedValue(mockProfile);

      await controller.getUser({ username: 'torvalds' });

      expect(service.fetchProfile).toHaveBeenCalledWith('torvalds');
    });
  });
});
