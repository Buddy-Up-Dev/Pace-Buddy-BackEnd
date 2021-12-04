import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { PostService } from "../post/post.service";
import { Post } from "../post/post.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Report, Post])],
  providers: [ReportService, ReportResolver, PostService]
})
export class ReportModule {}
