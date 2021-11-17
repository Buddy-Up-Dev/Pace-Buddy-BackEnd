import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import fetch from "node-fetch";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {

  }

  public async tokenTest(): Promise<string> {
    const payload: object = {userIndex: 1};
    const jwtToken = this.jwtService.sign(payload);
    console.info(jwtToken);

    return 'a';
  }

  public async naverLogin(accessToken: string): Promise<string> {
    console.log('accessToken >', accessToken);
    // Logic: userInfo 조회 => duplicate 확인
    const response = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET',
      headers: { 'Authorization' : `Bearer ${accessToken}` }
    })
    const result = await response.text();
    console.log('result >', result);

    return 'aa';
  }

}
