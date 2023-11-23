import { AuthService } from './shared/auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/shared/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/shared/user.model';
import { LocalStrategy } from './local.auth';
import { jwtConstants } from './shared/constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  providers: [AuthService, AuthService, UsersService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
