import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthService } from "../auth/auth.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from "@nestjs/jwt";
import { User } from './user.entity';

/*
  TODO : AuthService method 사용하려고 하는데 JWT module까지 import 해와야만 에러 발생 안함 => 원인 확인
*/

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: 3600}
    }),
  ],
  providers: [UserService, UserResolver, AuthService]
})
export class UserModule {}
