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
}
