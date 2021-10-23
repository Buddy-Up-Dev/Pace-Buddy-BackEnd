import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Post } from './post/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      definitions: {
        path: `${process.cwd() + '/src/graphql.ts'}`,
        outputAs: 'class',
        emitTypenameField: true
      }
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: +process.env.PORT,
      username: process.env.NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Post],
      synchronize: true
    }),
    UserModule, PostModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
