import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyJwt } from '../jwt';
import { UserRole } from '../roles';

type AccessPayload = {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: unknown }>();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authorization.slice('Bearer '.length).trim();

    try {
      const payload = verifyJwt<AccessPayload>(token, this.configService.getOrThrow<string>('env.jwtAccessSecret'));
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
