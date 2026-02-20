import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from './password';

@Injectable()
export class AdminBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('env.adminEmail') ?? 'admin@zippy.com.ar';
    let password = this.configService.get<string>('env.adminPassword');
    const exists = await this.prisma.user.findUnique({ where: { email } });

    if (exists) {
      return;
    }

    if (!password) {
      password = randomBytes(12).toString('base64url');
    }

    await this.prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        role: Role.ADMIN,
        firstName: 'Super',
        lastName: 'Admin',
        avatarUrl: 'https://placehold.co/128x128'
      }
    });

    this.logger.warn(`Superadmin created: ${email} / ${password}`);
  }
}
