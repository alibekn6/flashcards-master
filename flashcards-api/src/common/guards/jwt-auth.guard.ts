import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // console.log('Auth Error:', err);
    // console.log('User:', user);
    // console.log('Info:', info);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
