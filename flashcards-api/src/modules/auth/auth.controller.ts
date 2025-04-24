import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: AuthPayloadDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async register(
    @Body() authPayload: AuthPayloadDto,
  ): Promise<LoginResponseDto> {
    return this.authService.register(authPayload);
  }

  @Post('login')
  async login(@Body() authPayload: AuthPayloadDto) {
    const token = await this.authService.login(authPayload);
    return { token };
  }
}
