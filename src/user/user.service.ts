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

  public async getTrue(): Promise<Boolean> {
    return true;
  }

  public async getUserInformation(): Promise<object> {
    return this.userRepository.find();
  }
}
