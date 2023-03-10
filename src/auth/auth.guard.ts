import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const user = await this.userService.findById(decoded['id']);

        if (!user) {
          return false;
        }

        gqlContext['user'] = user;
        return true;
      } else {
        // when token has a problem
        return false;
      }
    } else {
      return false;
    }
  }
}
