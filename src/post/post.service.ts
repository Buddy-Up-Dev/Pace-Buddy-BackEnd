import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";

import { Post, Exercise } from "./post.entity";
import { User } from "../user/user.entity";
import { Like } from "../like/like.entity";

import { LikeService } from "../like/like.service";
import { PostDataDto } from "./DTO/post-data-dto";
import { PostInformation } from "../graphql";

@Injectable()
export class PostService {
  constructor() {}

  // TODO: Context 필요함 리턴 데이터를 스키마 타입에 맞게 Parse 해줘야 하는 문제 있음
  public async getAllLatestPost(context: object, orderByFlag: number): Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    // @ts-ignore
    // const token: string = context.req.headers['authorization'];
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

  public async getExercise(context: object): Promise<{ Index: number[]; Name: string[] }> {
    try {
      const exercise: Exercise[] = await getRepository(Exercise)
          .createQueryBuilder('e').select(['e.exerciseIndex', 'e.exerciseName']).getMany();
      const exerciseIndex: number[] = [];
      const name: string[] = [];
      for (const node of exercise) {
        exerciseIndex.push(node.exerciseIndex);
        name.push(node.exerciseName);
      }
      return { Index: exerciseIndex, Name: name };
    } catch(e) {
      throw new Error(e);
    }
  }

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

//   async addNewPost (token: string, uploadData: string, exercise: number, content: string, condition: number,
//                         feedOpen: number): Promise<Boolean> {
//     let userIndex = -1;
//
//     // TODO: JWT Logic
//
//     try {
//
//     }
//
//     return true;
//   }
// }
}
