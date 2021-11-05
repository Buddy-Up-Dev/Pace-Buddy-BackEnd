import { Injectable } from '@nestjs/common';
import { getRepository } from "typeorm";
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor() {

  }

  async getLike(postIndex: number): Promise<number> {
    try {
      return await getRepository(Like)
        .createQueryBuilder('l').select('*')
        .where('l.postIndex = :postIndex', { postIndex: postIndex }).getCount();
    } catch (e) {
      throw new Error(e);
    }
  }
}
