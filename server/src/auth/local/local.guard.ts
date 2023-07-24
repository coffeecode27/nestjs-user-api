import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalGuard extends PassportStrategy(Strategy) {
  constructor(private autService: UsersService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.autService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
