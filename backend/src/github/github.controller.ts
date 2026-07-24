import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubProfileDto } from './dto/github-profile.dto';
import { UsernameParamDto } from './dto/username-param.dto';

@Controller('user')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':username')
  async getUser(
    @Param() params: UsernameParamDto,
  ): Promise<GithubProfileDto> {
    return this.githubService.fetchProfile(params.username);
  }
}
