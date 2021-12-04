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
      return (await this.likeRepository.find({ where: { postIndex: postIndex } })).length;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getLikeByUser(userIndex: number): Promise<Like[]> {
    try {
      return this.likeRepository.find({
        select: ["postIndex"],
        where: { userIndex: userIndex }
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async addLike(postIndex: number, userIndex: number): Promise<boolean> {
    try {
      await this.likeRepository.save(new Like(userIndex, postIndex).getLikeInfo());
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteLike(postIndex: number, userIndex: number): Promise<boolean> {
    try {
      await this.likeRepository.delete({ postIndex: postIndex, userIndex: userIndex });
      return true;
    } catch(e) {
      throw new Error(e);
    }
  }

  public async deleteUserLike(userIndex: number): Promise<boolean> {
    try {
      await this.likeRepository.delete({ userIndex: userIndex });
      return true;
    } catch(e) {
      throw new Error(e);
    }
  }
}
