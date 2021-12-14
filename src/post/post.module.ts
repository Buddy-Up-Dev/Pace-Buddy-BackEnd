import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { AuthService } from "../auth/auth.service";
import { PostResolver } from './post.resolver';
import { LikeService } from "../like/like.service";
import { ReportService } from "../report/report.service";
import { ExerciseService } from "../exercise/exercise.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { Like } from "../like/like.entity";
import { Report } from "../report/report.entity";
import { Exercise } from "../exercise/exercise.entity";
import { JwtModule } from "@nestjs/jwt";


/*
  TODO : JWT module까지 import 해와야만 에러 발생 안함 => 원인 확인
*/

@Module({
  imports: [
      TypeOrmModule.forFeature([Post, User, Like, Report, Exercise]),
      JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {expiresIn: 3600}
      }),
  ],
  providers: [PostService, PostResolver, UserService, LikeService, AuthService, ReportService, ExerciseService]
})
export class PostModule {}
