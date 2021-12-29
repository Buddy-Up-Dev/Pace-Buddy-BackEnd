import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { PostInformation, ReportData } from "../graphql";
import { UserService } from "../user/user.service";
import { LikeService } from "../like/like.service";
import { AuthService } from "../auth/auth.service";
import { ReportService } from "../report/report.service";
import { ExerciseService } from "../exercise/exercise.service";

@Resolver()
export class PostResolver {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private likeService: LikeService,
    private authService: AuthService,
    private reportService: ReportService,
    private exerciseService: ExerciseService
  ) {}

  @Query('getAllLatestPost')
  async getAllLatestPost(@Context() context: object, @Args('flag') orderByFlag: number, @Args('offset') offset: number):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getAllLatestPost(context, orderByFlag, offset, this.userService, this.likeService, this.authService);
  }

  @Query('getSpecificExercise')
  async getSpecificExercise(@Context() context: object, @Args('flag') orderByFlag: number, @Args('exercise') exercise: number, @Args('offset') offset: number):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getSpecificExercise(context, orderByFlag, exercise, offset, this.userService, this.likeService, this.authService);
  }

  @Query('getMyPost')
  async getMyPost(@Context() context: object):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getMyPost(context, this.userService, this.likeService, this.authService);
  }

  @Query('reporting')
  async reporting(@Context() context: object):
    Promise<ReportData> {
    return await this.postService.reporting(context, this.authService, this.reportService, this.exerciseService);
  }

  @Query('getMyDate')
  async getMyDate(@Context() context: object): Promise<string[]> {
    return await this.postService.getMyDate(context, this.authService);
  }

  @Mutation('addPost')
  async addPost(@Context() context: object, @Args('uploadDate') uploadDate: string, @Args('exercise') exercise: number,
    @Args('content') content: string, @Args('condition') condition: number, @Args('feedOpen') feedOpen: number
  ): Promise<Boolean> {
    return await this.postService.addPost(context, uploadDate, exercise, content, condition, feedOpen, this.authService);
  }

  @Mutation('modifyPost')
  async modifyPost(@Context() context: object, @Args('postIndex') postIndex: number, @Args('uploadDate') uploadDate: string,
    @Args('exercise') exercise: number, @Args('content') content: string, @Args('condition') condition: number,
    @Args('feedOpen') feedOpen: number
  ): Promise<Boolean> {
    return await this.postService.modifyPost(context, postIndex, uploadDate, exercise, content, condition, feedOpen, this.authService);
  }

  @Mutation('likePost')
  async likePost(@Context() context: object, @Args('postIndex') postIndex: number, @Args('isDelete') isDelete: boolean
  ): Promise<Boolean> {
    return await this.postService.likePost(context, postIndex, isDelete, this.likeService, this.authService);
  }

  @Mutation('deletePost')
  async deletePost(@Context() context: object, @Args('postIndex') postIndex: number
  ): Promise<Boolean> {
    return await this.postService.deletePost(context, postIndex, this.authService);
  }
}