import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";

@Resolver()
export class AuthResolver {
  constructor(
      private authService: AuthService,
      private userService: UserService
  ) {}

  @Mutation('naverLogin')
  async naverLogin(context: object, @Args('accessToken') accessToken: string): Promise<string> {
    return await this.authService.naverLogin(accessToken, this.userService);
  }

  @Mutation('kakaoLogin')
  async kakaoLogin(context: object, @Args('accessToken') accessToken: string): Promise<string> {
    await this.authService.kakaoLogin(accessToken, this.userService);
    return 'YES'
  }
}
