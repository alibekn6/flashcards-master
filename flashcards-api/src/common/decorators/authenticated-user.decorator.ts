import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { User } from '../../modules/auth/entities/user.entity';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!request.user) {
      throw new UnauthorizedException('User not found in request');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user;
  },
);
// export const AuthenticatedUser = createParamDecorator(
//   (data: unknown, cotext: ExecutionContext) => {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const request = cotext.switchToHttp().getRequest();
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     const user: User = request.user;
//     return user;
//   },
// );
