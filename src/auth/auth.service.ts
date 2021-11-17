import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../../dist/user/user.repository";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {
  }

  public async tokenTest(): Promise<string> {
    const payload: string = '1';
    const jwtToken = await this.jwtService.sign(payload);
    console.info(jwtToken);

    return 'a';
  }

}
