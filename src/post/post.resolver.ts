import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import {PostService} from "./post.service";
import {Post} from "./post.entity";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { LikeService } from "../like/like.service"
import { PostDataDto} from "./DTO/post-data-dto";
import { PostInformation } from "../graphql";

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

    return await this.postService.getAllLatestPost(context, orderByFlag);
  }

  @Query('getSpecificExercise')
  async getSpecificExercise(@Context() context: object, @Args('flag') orderByFlag: number, @Args('exercise') exercise: number):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    return await this.postService.getSpecificExercise(context, orderByFlag, exercise);
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
