import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";

import { User } from "./user.entity";

import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    this.userRepository = userRepository;
  }

  public async getUser(userIndex: number): Promise<object> {
    return this.userRepository.findOne({ userIndex: userIndex });
  }

  public async getUserNickname(context: any, authService: any): Promise<string> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];

    const [data] = await this.userRepository.find({
      select: ["userName"],
      where: { userIndex: userIndex }
    });
    return data.userName;
  }

  public async checkNewUser(userID: string, loginType: string): Promise<object> {
    if (loginType === "naver") {
      try {
        const [data] = await this.userRepository.find({
          select: ["userIndex"],
          where: { naverID: userID }
        });
        // 이미 가입한 유저
        if (data !== undefined) {
          return { status: "login", userIndex: data.userIndex };
        }
        // 새로 가입하는 유저
        else {
          const userIndex = await this.addNewUser(userID, loginType);
          return { status: "join", userIndex: userIndex };
        }
      } catch(e) {
        throw new Error(e);
      }
    }
    else if (loginType === "kakao") {
      try {
        const [data] = await this.userRepository.find({
          select: ["userIndex"],
          where: { kakaoID: userID }
        });
        // 이미 가입한 유저
        if (data !== undefined) {
          return { status: "login", userIndex: data.userIndex };
        }
        // 새로 가입하는 유저
        else {
          const userIndex = await this.addNewUser(userID, loginType);
          return { status: "join", userIndex: userIndex };
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  public async addNewUser(userID, loginType): Promise<number> {
    try {
      if (loginType === "naver") {
        const newName = this.makeDefaultName();
        const newUser = await this.userRepository.save({
          userName: await this.makeDefaultName(),
          naverID: userID
        });
        return newUser.userIndex;
      }
      else if (loginType === "kakao") {
        const newName = this.makeDefaultName();
        const newUser = await this.userRepository.save({
          userName: await this.makeDefaultName(),
          kakaoID: userID
        })
        return newUser.userIndex;
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  public async makeDefaultName(): Promise<string> {
    const buddy = '버디';
    let alpha = 65;
    let nick;
    const newUserIdx = await this.userRepository.count() + 1;

    if (newUserIdx < 10) {
      nick = String.fromCharCode(alpha).concat('00', String(newUserIdx));
    } else if (newUserIdx < 100) {
      nick = String.fromCharCode(alpha).concat('0', String(newUserIdx));
    } else {
      nick = String.fromCharCode(alpha).concat(String(newUserIdx));
    }
    return buddy.concat(nick);
  }

  // TODO : JWT LOGIC
  public async deleteUser(context: object): Promise<string> {
    const userIndex = 6;

    try {
      // User 테이블에서 삭제
      await this.userRepository.delete({ userIndex: userIndex });

      // Post 테이블에서 삭제

      // Like 테이블에서 삭제 ()
    } catch(e) {
      throw new Error(e);
    }

    return 'ok';
  }
}
