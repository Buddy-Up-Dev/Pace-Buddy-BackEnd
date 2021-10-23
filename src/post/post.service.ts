import { Injectable } from '@nestjs/common';
import { getRepository, getConnection } from 'typeorm';
import { PostRepository } from './post.repository';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  public async getTrue(): Promise<Boolean> {
    return true;
  }

  public async getAllLatestPost(): Promise<Post[]> {
    try {
      const res = await getRepository(Post)
        .createQueryBuilder('p').select(['p.postIndex', 'p.userIndex', 'p.exercise', 'p.condition', 'p.uploadDate'])
        .where('p.feedOpen = 1').getMany();
      console.info(res);

      return res;
    } catch (e) {
      throw new Error(e);
    }
  }
}