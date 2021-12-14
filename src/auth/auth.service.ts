import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import fetch from "node-fetch";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  public async tokenTest(context: object): Promise<string> {
    const payload: object = {userIndex: 1};
    const jwtToken = this.jwtService.sign(payload);
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
    try {
      if (response.status === 200) {
        const userInfo: object = await userService.checkNewUser(JSON.parse(result).response.id, 'naver');
        return await this.createToken(userInfo);
      } else {
        return 'naver login openAPI error: ' + response.statusText;
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  public async kakaoLogin(accessToken: string, userService: any): Promise<string> {
    // userInfo(id) 조회
    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    const result = await response.text();

    // 회원가입 및 로그인
    try {
      if (response.status === 200) {
        const userInfo: object = await userService.checkNewUser(JSON.parse(result).id, 'kakao');
        return await this.createToken(userInfo);
      } else {
        return 'kakao login openAPI error: ' + response.statusText;
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  public async createToken(userInfo: any): Promise<string> {
    return this.jwtService.sign({userIndex: userInfo.userIndex});
  }

  public async decodeToken(token): Promise<{ [p: string]: any } | string> {
    return this.jwtService.decode(token);
  }

}
