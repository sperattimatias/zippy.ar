import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID, createHash } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { hashPassword, verifyPassword } from './password';
import { UserRole } from './roles';
import { signJwt, verifyJwt } from './jwt';

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshTokenHash?: string;
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

const usersByEmail = new Map<string, UserRecord>();
const usersById = new Map<string, UserRecord>();

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if (usersByEmail.has(email)) {
      throw new ConflictException('Email is already registered');
    }

    const user: UserRecord = {
      id: randomUUID(),
      email,
      passwordHash: hashPassword(dto.password),
      role: dto.role ?? UserRole.PASSENGER
    };

    usersByEmail.set(email, user);
    usersById.set(user.id, user);

    return this.createAuthResponse(user);
  }

  login(dto: LoginDto) {
    const user = usersByEmail.get(dto.email.toLowerCase().trim());
    if (!user || !verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createAuthResponse(user);
  }

  refresh(refreshToken: string) {
    let payload: { sub: string; exp: number };
    try {
      payload = verifyJwt(refreshToken, this.configService.getOrThrow<string>('env.jwtRefreshSecret')) as { sub: string; exp: number };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = usersById.get(payload.sub);
    const incomingHash = createHash('sha256').update(refreshToken).digest('hex');

    if (!user?.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.createAuthResponse(user);
  }

  private createAuthResponse(user: UserRecord) {
    const tokens = this.issueTokens(user);
    user.refreshTokenHash = createHash('sha256').update(tokens.refreshToken).digest('hex');

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: 'Bearer' as const,
      expiresIn: tokens.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  private issueTokens(user: UserRecord): TokenPair {
    const expiresIn = Number(this.configService.get<number>('env.jwtAccessExpiresInSeconds', 900));
    const refreshExpiresIn = Number(this.configService.get<number>('env.jwtRefreshExpiresInSeconds', 604800));

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: now
    };

    const accessToken = signJwt(
      { ...payload, exp: now + expiresIn },
      this.configService.getOrThrow<string>('env.jwtAccessSecret')
    );
    const refreshToken = signJwt(
      { ...payload, exp: now + refreshExpiresIn },
      this.configService.getOrThrow<string>('env.jwtRefreshSecret')
    );

    return { accessToken, refreshToken, expiresIn };
  }
}
