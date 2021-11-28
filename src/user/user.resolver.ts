import { Resolver, Args, Query, Mutation, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { PostService } from "../post/post.service";
import { AuthService } from "../auth/auth.service";

@Resolver()
export class UserResolver {
  constructor(
      private userService: UserService,
      private authService: AuthService,
  ) {}

  @Query('userNickname')
  async userNickname(@Context() context: any): Promise<string> {
    return this.userService.getUserNickname(context, this.authService);
  }

  // @Mutation('deleteUser')
  // async deleteUser(context: object): Promise<string> {
  //   return this.userService.deleteUser(context);
  // }
}
