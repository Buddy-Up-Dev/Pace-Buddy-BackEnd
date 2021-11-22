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
      return await userService.checkNewUser(JSON.parse(result).response.id, 'naver');
    } else {
      console.log('naver openAPI error:', response.statusText);
    }

    return 'aa';
  }

}
