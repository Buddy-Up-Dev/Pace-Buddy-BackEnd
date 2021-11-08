import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./like.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikeService, LikeResolver]
})
export class LikeModule {}
