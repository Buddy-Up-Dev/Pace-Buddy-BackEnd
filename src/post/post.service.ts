import { Injectable } from "@nestjs/common";
import { getRepository, Repository } from "typeorm";

import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { Like } from "../like/like.entity";

import { PostDataDto } from "./DTO/post-data-dto";
import { PostInformation } from "../graphql";

import { UserService } from "../user/user.service";
import { LikeService } from "../like/like.service";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {
    this.postRepository = postRepository
  }

  public async testORM(): Promise<Post[]> {
    const test = this.postRepository.find();
    console.info(test);
    return test;
  }
  // TODO: Context 필요함 리턴 데이터를 스키마 타입에 맞게 Parse 해줘야 하는 문제 있음
  public async getAllLatestPost(context: object, orderByFlag: number, userService: UserService, likeService: LikeService)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;

    // TODO: JWT Logic

    try {
      const allLatestPost: Post[] = await getRepository(Post)
        .createQueryBuilder('p').select(['p.postIndex', 'p.userIndex',
          'p.exercise', 'p.content', 'p.condition', 'p.uploadDate', 'p.feedOpen'])
        .where('p.feedOpen = 1').getMany();
      let returnData: { likeArray: number[]; PostData: PostInformation[] } = await this.parseReturnData(allLatestPost, userIndex);
      if (orderByFlag === 1) returnData = this.sortByPopularity(returnData);
      return returnData;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getSpecificExercise(context: object, orderByFlag: number, exercise: number): Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    // @ts-ignore
    try {
      const specificPost: Post[] = await getRepository(Post)
          .createQueryBuilder('p').select(['p.postIndex', 'p.userIndex',
            'p.exercise', 'p.content', 'p.condition', 'p.uploadDate', 'p.feedOpen'])
          .where('p.feedOpen = 1')
          .andWhere('p.exercise = :exercise', { exercise: exercise })
          .getMany();
      let returnData: { likeArray: number[]; PostData: PostInformation[] } = await this.parseReturnData(specificPost, userIndex);
      if (orderByFlag === 1) returnData = this.sortByPopularity(returnData);
      return returnData;
    } catch(e) {
      throw new Error(e);
    }
  }

  public async getMyPost(context: object): Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    // @ts-ignore
    try {
      const allMyPost: Post[] = await getRepository(Post)
          .createQueryBuilder('p').select(['p.postIndex', 'p.userIndex',
            'p.exercise', 'p.content', 'p.condition', 'p.uploadDate', 'p.feedOpen'])
          .where('p.feedOpen = 1')
          .andWhere('p.userIndex = :userIndex', { userIndex: userIndex })
          .getMany();
      return await this.parseReturnData(allMyPost, userIndex);
    } catch (e) {
    }
  }

  // public async reporting(context: object): Promise<> {
  //   let userIndex: number = 1;
  //   // @ts-ignore
  //   try {
  //     const reporting:
  //   } catch(e) {
  //     throw new Error(e);
  //   }
  // }

  private async parseReturnData(data: Post[], userIndex: number): Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    const returnData: object[] = [];
    for (const node of data) {
      returnData.push({
        Post: node,
        User: await getRepository(User)
          .createQueryBuilder('u').select(['u.userIndex', 'u.userName', 'u.naverID', 'u.kakaoID'])
          .where('u.userIndex = :userIndex', {userIndex: node.userIndex}).getOne(),
        Like: await getRepository(Like)
          .createQueryBuilder('l').select('*')
          .where('l.postIndex = :postIndex', { postIndex: node.postIndex }).getCount()
      })
      node.uploadDate = JSON.stringify(node.uploadDate).slice(6, 8) + "." + JSON.stringify(node.uploadDate).slice(9, 11);
    }
    const returnLike = await this.getLikeCount(userIndex);
    const getPostData: PostDataDto = new PostDataDto(returnData, returnLike);
    return getPostData.getPostData();
  }

  private sortByPopularity(data): PostDataDto {
    return data.sort((a, b) => {
      return parseFloat(b.Like) - parseFloat(a.Like);
    });
  }

  async getLikeCount(userIndex: number): Promise<number[]> {
    const returnLike: number[] = [];
    const likeArray: Like[] = await getRepository(Like)
      .createQueryBuilder('l').select('l.postIndex')
      .where('l.userIndex = :userIndex', { userIndex: userIndex })
      .getMany();
    for (const node of likeArray) {
      returnLike.push(node.postIndex);
    }
    return returnLike;
  }

  async reporting(context: object): Promise<number> {
    let userIndex = -1;
    // TODO: JWT Decode 추후 추가 예정
    // TODO: 여기서 Entity가 필요하다고 한거구나

    return 1;
  }

  async addNewPost (token: string, uploadData: string, exercise: number, content: string, condition: number,
                        feedOpen: number): Promise<Boolean> {
    let userIndex = -1;

    // TODO: JWT Logic

    return true;
  }
}
