import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { LikeModule } from "./like/like.module";

import { User } from "./user/user.entity";
import { Post } from "./post/post.entity";
import { Like } from "./like/like.entity";
import { Exercise } from "./exercise/exercise.entity";
import { ExerciseModule } from "./exercise/exercise.module";
import { AuthModule } from "./auth/auth.module";
import { ReportModule } from './report/report.module';
import { Report } from "./report/report.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot({
      typePaths: ["./**/*.graphql"],
      installSubscriptionHandlers: true,
      context: ( {req} ) => {
        const user = req.headers.authorization;
        return {
          ...req, user
        };
      },
      definitions: {
        path: `${process.cwd() + "/src/graphql.ts"}`,
        outputAs: "class",
        emitTypenameField: true
      }
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.HOST,
      port: +process.env.PORT,
      username: process.env.NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Post, Like, Exercise, Report]
    }),
    UserModule, PostModule, LikeModule, ExerciseModule, AuthModule, ReportModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
