import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    authPayload: AuthPayloadDto,
  ): Promise<{ accessToken: string }> {
    const existingUser = await this.userRepo.findOne({
      where: { email: authPayload.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(authPayload.password, saltRounds);

    const user = this.userRepo.create({
      email: authPayload.email,
      passwordHash: passwordHash,
    });

    await this.userRepo.save(user);

    const accessToken = this.jwtService.sign({
      sub: user.id,
    });

    return { accessToken };
  }

  async login({
    email,
    password,
  }: AuthPayloadDto): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
      }),
    };
  }

  async findUserById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
