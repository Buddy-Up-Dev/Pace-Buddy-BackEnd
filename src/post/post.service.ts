import { Injectable } from "@nestjs/common";
import { getConnection, getRepository, Repository } from "typeorm";

import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { Like } from "../like/like.entity";

import { PostDataDto } from "./DTO/post-data-dto";
import { PostInformation } from "../graphql";

import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {
    this.postRepository = postRepository
  }

  public async testORM(userService: any, likeService: any): Promise<any> {
    // const test = await this.userService.getUserRepository().find();
    const test: object = await this.postRepository.find();
    console.info(await userService.getUserRepository().find());
    return test;
  }

  // TODO: Context 필요함 리턴 데이터를 스키마 타입에 맞게 Parse 해줘야 하는 문제 있음
  public async getAllLatestPost(context: object, orderByFlag: number, userService: any, likeService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;

    // TODO: JWT Logic

    try {
      const allLatestPost: Post[] = await this.postRepository.find();
      let returnData: { likeArray: number[]; PostData: PostInformation[] } =
        await this.parseReturnData(allLatestPost, userIndex, userService, likeService);
      if (orderByFlag === 1) returnData = this.sortByPopularity(returnData);
      return returnData;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getSpecificExercise(context: object, orderByFlag: number, exercise: number, userService: any, likeService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    // @ts-ignore
    try {
      const specificPost: Post[] = await getRepository(Post)
          .createQueryBuilder('p').select(['p.postIndex', 'p.userIndex',
            'p.exercise', 'p.content', 'p.condition', 'p.uploadDate', 'p.feedOpen'])
          .where('p.feedOpen = 1')
          .andWhere('p.exercise = :exercise', { exercise: exercise })
          .getMany();
      let returnData: { likeArray: number[]; PostData: PostInformation[] } = await this.parseReturnData(specificPost, userIndex, userService, likeService);
      if (orderByFlag === 1) returnData = this.sortByPopularity(returnData);
      return returnData;
    } catch(e) {
      throw new Error(e);
    }
  }

  public async getMyPost(context: object, userService: any, likeService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    // @ts-ignore
    try {
      const allMyPost: Post[] = await getRepository(Post)
        .createQueryBuilder('p').select(['p.postIndex', 'p.userIndex',
          'p.exercise', 'p.content', 'p.condition', 'p.uploadDate', 'p.feedOpen'])
        .where('p.feedOpen = 1')
        .andWhere('p.userIndex = :userIndex', { userIndex: userIndex })
        .getMany();
      return await this.parseReturnData(allMyPost, userIndex, userService, likeService);
    } catch (e) {
      throw new Error("Error: " + e);
    }
  }

  private async parseReturnData(data: Post[], userIndex: number, userService: any, likeService: any):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    const returnData: object[] = [];
    for (const node of data) {
      returnData.push({
        Post: node,
        User: userService.getUserInformation(),
        Like: likeService.getLike(node.postIndex)
        // User: await getRepository(User)
        //   .createQueryBuilder('u').select(['u.userIndex', 'u.userName', 'u.naverID', 'u.kakaoID'])
        //   .where('u.userIndex = :userIndex', {userIndex: node.userIndex}).getOne(),
        // Like: await getRepository(Like)
        //   .createQueryBuilder('l').select('*')
        //   .where('l.postIndex = :postIndex', { postIndex: node.postIndex }).getCount()
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

  // TODO: JWT Decode 추후 추가 예정
  // TODO: 여기서 Entity가 필요하다고 한거구나
  // public async reporting(context: object): Promise<> {
  //   let userIndex: number = 1;
  //   // @ts-ignore
  //   try {
  //     const reporting:
  //   } catch(e) {
  //     throw new Error(e);
  //   }
  // }

  // TODO : JWT Logic
  async addPost(context: object, uploadDate: string, exercise: number, content: string, condition: number, feedOpen: number): Promise<boolean> {
    let userIndex: number = 1;
    try {
      await getConnection().createQueryBuilder()
          .insert().into(Post)
          .values({
            userIndex: userIndex,
            exercise: exercise,
            content: content,
            condition: condition,
            uploadDate: uploadDate,
            feedOpen: feedOpen
          })
          .execute();
      return true;
    } catch(e) {
      throw new Error(e);
    }
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

}
