import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { Post, PostInformation } from "../graphql";
import { UserService } from "../user/user.service";
import { LikeService } from "../like/like.service";

@Resolver()
export class PostResolver {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private likeService: LikeService
  ) {}

  @Query('getAllLatestPost')
  async getAllLatestPost(@Context() context: object, @Args('flag') orderByFlag: number):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getAllLatestPost(context, orderByFlag, this.userService, this.likeService);
  }

  @Query('getSpecificExercise')
  async getSpecificExercise(@Context() context: object, @Args('flag') orderByFlag: number, @Args('exercise') exercise: number):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getSpecificExercise(context, orderByFlag, exercise, this.userService, this.likeService);
  }

  @Query('getMyPost')
  async getMyPost(context: object):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getMyPost(context, this.userService, this.likeService);
  }

  @Query('reporting')
  async reporting(@Context() context: object): Promise<number> {
    return await this.postService.reporting(context);
  }

  @Query('getMyDate')
  async getMyDate(@Context() context: object): Promise<string[]> {
    return await this.postService.getMyDate(context);
  }

  @Mutation('addPost')
  async addPost(@Context() context: object, @Args('uploadDate') uploadDate: string, @Args('exercise') exercise: number,
      @Args('content') content: string, @Args('condition') condition: number, @Args('feedOpen') feedOpen: number
  ): Promise<Boolean> {
    return await this.postService.addPost(context, uploadDate, exercise, content, condition, feedOpen);
  }

  @Mutation('likePost')
  async likePost(@Context() context: object, @Args('postIndex') postIndex: number, @Args('isDelete') isDelete: boolean
  ): Promise<Boolean> {
    return await this.postService.likePost(context, postIndex, isDelete, this.likeService);
  }
}
