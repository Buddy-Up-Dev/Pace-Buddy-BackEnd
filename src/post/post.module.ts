import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { UserService } from '../user/user.service'
import { PostResolver } from './post.resolver';
import { LikeService } from "../like/like.service";
import { TypeOrmModule } from '@nestjs/typeorm'


@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [PostService, PostResolver, UserService, LikeService]
})
export class PostModule {}
