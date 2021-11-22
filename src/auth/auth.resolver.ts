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
    console.info(process.env);
    await this.authService.tokenTest();
    return true;
  }

  @Mutation('naverLogin')
  async naverLogin(context: object, @Args('accessToken') accessToken: string): Promise<string> {
    const data = await this.authService.naverLogin(accessToken, this.userService);
    console.log(data);
    return 'naverLogin API 구현 중'
  }

}
