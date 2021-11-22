import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { PostResolver } from './post.resolver';
import { LikeService } from "../like/like.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { Like } from "../like/like.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Post, User, Like]),
  ],
  providers: [PostService, PostResolver, UserService, LikeService]
})
export class PostModule {}
