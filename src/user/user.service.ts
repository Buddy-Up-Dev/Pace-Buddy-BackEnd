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

  // TODO: JWT LOGIC
  public async getUserNickname(context: object): Promise<string> {
    const userIndex = 1;
    const [data] = await this.userRepository.find({
      select: ["userName"],
      where: { userIndex: userIndex }
    });
    return data.userName;
  }

  public async checkNewUser(userID: string, loginType: string): Promise<object> {
    if (loginType === "naver") {
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
    }
  }

  public async addNewUser(userID, loginType): Promise<number> {
    try {
      if (loginType === "naver") {
        const newName = this.makeDefaultName();
        await this.userRepository.save({
          userName: await this.makeDefaultName(),
          naverID: userID
        });
      }
    } catch(e) {
      throw new Error(e);
    }
    return 1;
  }

  // TODO : User DB 내 유저 수 확인 후 기본 닉네임 생성
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
}
