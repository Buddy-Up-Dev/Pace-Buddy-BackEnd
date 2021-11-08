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

  async addLike(postIndex: number, userIndex: number) {
    let newLike: Like = new Like();
    newLike.userIndex = userIndex;
    newLike.postIndex = postIndex;
    return await this.likeRepository.save(newLike);
  }

  async deleteLike(postIndex: number, userIndex: number) {
    return await this.likeRepository.delete({
      postIndex: postIndex,
      userIndex: userIndex
    });
  }
}
