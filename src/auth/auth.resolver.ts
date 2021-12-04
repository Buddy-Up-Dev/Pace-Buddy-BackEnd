import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";

@Resolver()
export class AuthResolver {
  constructor(
      private authService: AuthService,
      private userService: UserService
  ) {}

  @Query('testToken')
  async testToken(): Promise<boolean> {
    console.info('process.env >', process.env);
    // await this.authService.tokenTest();
    return true;
  }

  @Mutation('naverLogin')
  async naverLogin(context: object, @Args('accessToken') accessToken: string): Promise<string> {
    return await this.authService.naverLogin(accessToken, this.userService);
  }

  @Mutation('kakaoLogin')
  async kakaoLogin(context: object, @Args('accessToken') accessToken: string): Promise<string> {
    return await this.authService.kakaoLogin(accessToken, this.userService);
  }
}
