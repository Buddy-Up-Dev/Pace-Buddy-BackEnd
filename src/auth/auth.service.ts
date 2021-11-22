import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/user.entity";

import fetch from "node-fetch";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  public async tokenTest(): Promise<string> {
    const payload: object = {userIndex: 1};
    const jwtToken = this.jwtService.sign(payload);
    console.info(jwtToken);
    const decode = this.jwtService.decode(jwtToken);
    console.info(decode);
    return 'a';
  }

  public async naverLogin(accessToken: string, userService: any): Promise<string> {
    // userInfo(id) 조회
    const response = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET',
      headers: { 'Authorization' : `Bearer ${accessToken}` }
    })
    const result = await response.text();

    // 회원가입 및 로그인
    if (response.status === 200) {
      const userInfo: object = await userService.checkNewUser(JSON.parse(result).response.id, 'naver');
      return await this.createToken(userInfo)

    } else {
      return 'naver openAPI error:' + response.statusText;

    }
  }

  public async createToken(userInfo: any): Promise<string> {
    console.info(userInfo.userIndex);
    const jwtToken = this.jwtService.sign({userIndex: userInfo.userIndex});
    console.info(jwtToken);
    return jwtToken;
  }

  public async decodeToken(token): Promise<number> {

    return 1;

  }

}
