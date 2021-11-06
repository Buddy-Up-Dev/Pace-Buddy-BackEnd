import { Injectable } from '@nestjs/common';
import { getRepository, Repository } from "typeorm";
import { Like } from './like.entity';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LikeService {
  constructor(@InjectRepository(Like) private likeRepository: Repository<Like>) {
    this.likeRepository = likeRepository
  }
  async getLikeByPost(postIndex: number): Promise<number> {
    try {
      return await getRepository(Like)
        .createQueryBuilder('l').select('*')
        .where('l.postIndex = :postIndex', { postIndex: postIndex }).getCount();
    } catch (e) {
      throw new Error(e);
    }
  }

  async getLikeByUser(userIndex: number): Promise<Like[]> {
    return this.likeRepository.find({select: ["postIndex"], where: {userIndex: userIndex}});
  }
}
