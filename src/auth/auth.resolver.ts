import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {
  }

  @Query('testToken')
  async testToken(): Promise<boolean> {
    console.info(process.env);
    await this.authService.tokenTest();
    return true;
  }

  @Mutation('naverLogin')
  async naverLogin(context: object, @Args('accessToken') accessToken: string): Promise<string> {
    await this.authService.naverLogin(accessToken);
    return 'a'
  }

}
