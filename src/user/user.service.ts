import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";

import { Post } from "../post/post.entity";
import { User } from "./user.entity";

import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    this.userRepository = userRepository;
  }

  public async getTrue(): Promise<Boolean> {
    return true;
  }

  public getUserRepository(): object {
    return this.userRepository;
  }
}
