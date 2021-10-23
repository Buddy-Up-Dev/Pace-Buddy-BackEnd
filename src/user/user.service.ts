import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  public async getTrue(): Promise<Boolean> {
    return true;
  }
}
