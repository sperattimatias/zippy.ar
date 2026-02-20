import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { signJwt, verifyJwt } from './jwt';
import { hashPassword, verifyPassword } from './password';

type TokenPair = { accessToken: string; refreshToken: string; expiresIn: number };

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    if (!dto.acceptTerms) throw new BadRequestException('Terms acceptance is required');
    const email = dto.email.toLowerCase().trim();
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(dto.password),
        role: Role.PASSENGER,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone?.trim()
      }
    });

    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; exp: number };
    try {
      payload = verifyJwt(refreshToken, this.configService.getOrThrow<string>('env.jwtRefreshSecret')) as { sub: string; exp: number };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    const incomingHash = createHash('sha256').update(refreshToken).digest('hex');
    if (!user?.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.createAuthResponse(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
    return { success: true };
  }

  getMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { favorites: true, driverProfile: true }
    });
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { firstName: dto.firstName, lastName: dto.lastName, avatarUrl: dto.avatarUrl }
    });
  }

  private async createAuthResponse(user: User) {
    const tokens = this.issueTokens(user);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: createHash('sha256').update(tokens.refreshToken).digest('hex') }
    });
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, tokenType: 'Bearer' as const, expiresIn: tokens.expiresIn, user: { id: user.id, email: user.email, role: user.role } };
  }

  private issueTokens(user: User): TokenPair {
    const expiresIn = Number(this.configService.get<number>('env.jwtAccessExpiresInSeconds', 900));
    const refreshExpiresIn = Number(this.configService.get<number>('env.jwtRefreshExpiresInSeconds', 604800));
    const now = Math.floor(Date.now() / 1000);
    const payload = { sub: user.id, email: user.email, role: user.role, iat: now };
    return {
      accessToken: signJwt({ ...payload, exp: now + expiresIn }, this.configService.getOrThrow<string>('env.jwtAccessSecret')),
      refreshToken: signJwt({ ...payload, exp: now + refreshExpiresIn }, this.configService.getOrThrow<string>('env.jwtRefreshSecret')),
      expiresIn
    };
  }
}
