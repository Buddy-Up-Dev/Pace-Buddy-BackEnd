import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthResolver } from './auth.resolver';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: 3600}
    })
  ],
  providers: [AuthService, AuthResolver]
})
export class AuthModule {}
