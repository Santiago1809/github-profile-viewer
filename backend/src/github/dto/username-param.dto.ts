import { Matches } from 'class-validator';

export class UsernameParamDto {
  @Matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?!-)){0,38}$/, {
    message: 'Invalid username format',
  })
  username: string;
}
