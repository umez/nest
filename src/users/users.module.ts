import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, {
    provide: APP_INTERCEPTOR,
    useClass : CurrentUserInterceptor  /// setting cureent user interceptor in the entire module
  }]
})
export class UsersModule {}
