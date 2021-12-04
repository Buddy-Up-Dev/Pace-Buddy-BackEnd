import { Resolver, Args, Query, Mutation, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { PostService } from "../post/post.service";
import { LikeService } from "../like/like.service";
import { AuthService } from "../auth/auth.service";

@Resolver()
export class UserResolver {
  constructor(
      private userService: UserService,
      private postService: PostService,
      private likeService: LikeService,
      private authService: AuthService,
  ) {}

  @Query('userNickname')
  async userNickname(@Context() context: object): Promise<string> {
    return this.userService.getUserNickname(context, this.authService);
  }

  @Mutation('deleteUser')
  async deleteUser(@Context() context: object): Promise<boolean> {
    return this.userService.deleteUser(context, this.postService, this.likeService, this.authService);
  }

  @Mutation('uploadProfile')
  async uploadProfile(@Context() context: object, @Args('imgURL') imgURL: string): Promise<boolean> {
    return this.userService.uploadProfile(context, imgURL, this.authService);
  }
}
