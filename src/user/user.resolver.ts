import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service'
import { User } from './user.entity'
import { PostService } from "../post/post.service";

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query('userNickname')
  async userNickname(context: object): Promise<string> {
    return this.userService.getUserNickname(context);
  }
}
