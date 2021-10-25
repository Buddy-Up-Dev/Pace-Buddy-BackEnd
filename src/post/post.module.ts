import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { LikeService } from "../like/like.service";
import { TypeOrmModule } from '@nestjs/typeorm'


@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [PostService, PostResolver, LikeService]
})
export class PostModule {}
