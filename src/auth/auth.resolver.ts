import { Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {
  }

  @Query('userNickname')
  async userNickname(context: object): Promise<string> {
    return this.authService
  }

}
