import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from "../user/user.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthResolver } from './auth.resolver';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";

/*
  TODO : User Entity 가 필요 없는데 import 해와야만 에러 발생 안함 => 원인 확인
*/

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: 3600}
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, AuthResolver, UserService]
})
export class AuthModule {}
