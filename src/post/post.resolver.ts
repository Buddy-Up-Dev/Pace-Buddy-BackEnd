import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import {PostService} from "./post.service";
import {Post} from "./post.entity";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { LikeService } from "../like/like.service"
import { PostDataDto} from "./DTO/post-data-dto";
import { PostInfomation } from "../graphql";

@Resolver()
export class PostResolver {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private likeService: LikeService
  ) {}

  @Query('getAllLatestPost')
  async getAllLatestPost(@Context() context: object, @Args('flag') orderByFlag: number):
    Promise<{ likeArray: number[]; PostData: PostInfomation[] }> {

    return await this.postService.getAllLatestPost(context, orderByFlag);
  }

  @Query('postQuery')
  async userQuery(@Context() context:object, @Args('test') test:number,
                  @Args('test_') test_:string): Promise<Boolean> {
    return this.postService.getTrue(context, test, test_, this.likeService);
  }

  // @Mutation('postMutation')
  // async userMutation(@Context() context: object): Promise<Boolean> {
  //   return this.postService.getTrue(context);
  // }
}
