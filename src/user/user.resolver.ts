import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service'
import { User } from './user.entity'
import { PostService } from "../post/post.service";

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query('userQuery')
  async userQuery(): Promise<Boolean> {
    return this.userService.getTrue();
  }

  @Mutation('userMutation')
  async userMutation(): Promise<Boolean> {
    return this.userService.getTrue();
  }
}
