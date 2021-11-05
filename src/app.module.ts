import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';

import { User } from './user/user.entity';
import { Post, Exercise } from './post/post.entity';
import { Like } from './like/like.entity';
import { ExerciseModule } from './exercise/exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      context: () => {
        const { request: req } = require('express');
        return {
          req
        }
      },
      definitions: {
        path: `${process.cwd() + '/src/graphql.ts'}`,
        outputAs: 'class',
        emitTypenameField: true,
      }
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: +process.env.PORT,
      username: process.env.NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Post, Like, Exercise],
      synchronize: true
    }),
    UserModule, PostModule, LikeModule, ExerciseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
