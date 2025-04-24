// src/common/guards/jwt-auth.guard.ts
import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add custom authentication logic here
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    // Custom error handling
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
