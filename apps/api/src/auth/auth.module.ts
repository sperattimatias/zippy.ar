import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AdminBootstrapService } from './admin-bootstrap.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, AdminBootstrapService],
  exports: [AuthService, JwtAuthGuard, RolesGuard]
})
export class AuthModule {}
