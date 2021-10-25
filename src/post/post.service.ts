import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";
import { Post } from "./post.entity";
import { LikeService } from "../like/like.service";

@Injectable()
export class PostService {
  constructor() {}

  public async getTrue(context: object, test: number, test_: string, likeService: LikeService): Promise<Boolean> {
    // @ts-ignore
    console.info(await likeService.getLike(1));
    return true;
  }

  // TODO: Context 필요함 리턴 데이터를 스키마 타입에 맞게 Parse 해줘야 하는 문제 있음
  public async getAllLatestPost(context: object, orderByFlag: number): Promise<Post[]> {
    let userIndex = -1;
    // @ts-ignore
    // const token: string = context.req.headers['authorization'];

    if (token !== undefined) {

    }

    try {
      return await getRepository(Post)
        .createQueryBuilder('p').select(['p.postIndex', 'p.userIndex',
          'p.exercise', 'p.content', 'p.condition', 'p.uploadDate', 'p.feedOpen'])
        .where('p.feedOpen = 0').getMany();
    } catch (e) {
      throw new Error(e);
    }
  }

  // private async parseReturnData()
}