import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/auth/entities/user.entity';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, cotext: ExecutionContext) => {
    const request = cotext.switchToHttp().getRequest();
    const user: User = request.user;
    return user;
  },
);
