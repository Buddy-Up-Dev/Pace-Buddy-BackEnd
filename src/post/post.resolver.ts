import { Mutation, Query, Resolver } from "@nestjs/graphql";
import {PostService} from "./post.service";
import {Post} from "./post.entity";

@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query('getAllLatestPost')
  async getAllLatestPost(): Promise<Post[]> {
    return await this.postService.getAllLatestPost();
  }

  @Query('postQuery')
  async userQuery(): Promise<Boolean> {
    return this.postService.getTrue();
  }

  @Mutation('postMutation')
  async userMutation(): Promise<Boolean> {
    return this.postService.getTrue();
  }
}
