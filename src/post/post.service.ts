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
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>,) {
    this.postRepository = postRepository
  }

  public async getAllLatestPost(context: object, orderByFlag: number, userService: any, likeService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    // TODO: JWT Logic
    try {
      const allLatestPost: Post[] = await this.postRepository.find();
      let returnData: { likeArray: number[]; PostData: PostInformation[] } =
        await this.parseReturnData(allLatestPost, userIndex, userService, likeService);
      if (orderByFlag === 1) returnData.PostData = this.sortByPopularity(returnData.PostData);
      return returnData;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getSpecificExercise(context: object, orderByFlag: number, exercise: number, userService: any, likeService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    try {
      const specificPost: Post[] = await this.postRepository.find({ where: {exercise: exercise, feedOpen: 1} });
      let returnData: { likeArray: number[]; PostData: PostInformation[] } =
        await this.parseReturnData(specificPost, userIndex, userService, likeService);
      if (orderByFlag === 1) returnData.PostData = this.sortByPopularity(returnData);
      return returnData;
    } catch(e) {
      throw new Error(e);
    }
  }

  public async getMyPost(context: object, userService: any, likeService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    let userIndex: number = 1;
    try {
      const allMyPost: Post[] = await this.postRepository.find({where: {userIndex: userIndex, feedOpen: 1}})
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
        User: await userService.getUser(node.userIndex),
        Like: await likeService.getLikeByPost(node.postIndex)
      })
      node.uploadDate = JSON.stringify(node.uploadDate).slice(6, 8) + "." + JSON.stringify(node.uploadDate).slice(9, 11);
    }
    const returnLike = await this.getLikeCount(userIndex, likeService);
    const getPostData: PostDataDto = new PostDataDto(returnData, returnLike);
    return getPostData.getPostData();
  }

  private sortByPopularity(data): PostDataDto['PostData'] {
    return data.sort((a, b) => {
      return parseFloat(b.Like) - parseFloat(a.Like);
    });
  }

  // TODO : JWT Logic
  async addPost(context: object, uploadDate: string, exercise: number, content: string, condition: number, feedOpen: number): Promise<boolean> {
    let userIndex: number = 1;
    try {
      await this.postRepository.save(new Post(userIndex, uploadDate, exercise, content, condition, feedOpen).getPostInfo());
      return true;
    } catch(e) {
      throw new Error(e);
    }
  }

  // TODO : JWT Logic
  async likePost(context: object, postIndex: number, isDelete: boolean, likeService: any): Promise<boolean> {
    let userIndex: number = 1;
    try {
      if (isDelete) {
        await likeService.deleteLike(postIndex, userIndex);
        return true;
      } else {
        await likeService.addLike(postIndex, userIndex);
        return true;
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  async getLikeCount(userIndex: number, likeService: any): Promise<number[]> {
    const likeArray: Like[] = await likeService.getLikeByUser(userIndex);
    return likeArray.map(node => node.postIndex);
  }

  public async reporting(context: object): Promise<number> {
    const userIndex: number = 1;
    return 1;
  }

  public async getMyDate(context: object): Promise<string[]> {
    const userIndex: number = 1;
    try {
      const test: object = await this.postRepository.find({
        select: ["uploadDate"],
        where: { userIndex: userIndex }
      });

      for (const e of Object.entries(test)) {
        console.log('e >', e[1].uploadDate);
      }

      return ['1', '2'];
    } catch (e) {
      throw new Error(e);
    }
  }
}
