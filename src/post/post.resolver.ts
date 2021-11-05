import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { Post, PostInformation } from "../graphql";

@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query('testORM')
  async testOrm(): Promise<Post[]> {
    return await this.postService.testORM();
  }

  @Query('getAllLatestPost')
  async getAllLatestPost(@Context() context: object, @Args('flag') orderByFlag: number):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getAllLatestPost(context, orderByFlag);
  }

  @Query('getSpecificExercise')
  async getSpecificExercise(@Context() context: object, @Args('flag') orderByFlag: number, @Args('exercise') exercise: number):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getSpecificExercise(context, orderByFlag, exercise);
  }

  @Query("getMyPost")
  async getMyPost(@Context() context: object):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getMyPost(context);
  }

  @Query("reporting")
  async reporting(@Context() context: object): Promise<number> {
    return await this.postService.reporting(context);
  }

  @Mutation('addPost')
  async addPost(@Context() context: object, @Args('uploadDate') uploadDate: string,
                @Args('exercise') exercise: number, @Args('content') content: string,
                @Args('condition') condition: number, @Args('feedOpen') feedOpen: number): Promise<Boolean> {


    return await this.postService.addNewPost(context["req"].headers["authorization"],
        uploadDate, exercise, content, condition, feedOpen);
  }

  // @Mutation('postMutation')
  // async userMutation(@Context() context: object): Promise<Boolean> {
  //   return this.postService.getTrue(context);
  // }
}
