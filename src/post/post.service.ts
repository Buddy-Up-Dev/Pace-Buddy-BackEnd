import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { Post } from "./post.entity";
import { Like } from "../like/like.entity";

import { PostDataDto } from "./DTO/post-data-dto";
import { PostInformation } from "../graphql";

import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>,) {
    this.postRepository = postRepository
  }

  public async getAllLatestPost(context: any, orderByFlag: number, userService: any, likeService: any, authService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {

    let userIndex = -1;
    const req = context.req.headers.authorization;
    if(req !== undefined) {
      const token = req.substr(7, req.length - 7);
      const decode = await authService.decodeToken(token);
      userIndex = decode['userIndex'];
    }

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

  public async getSpecificExercise(context: any, orderByFlag: number, exercise: number, userService: any, likeService: any, authService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {

    let userIndex = -1;
    const req = context.req.headers.authorization;
    if(req !== undefined) {
      const token = req.substr(7, req.length - 7);
      const decode = await authService.decodeToken(token);
      userIndex = decode['userIndex'];
    }

    try {
      const specificPost: Post[] = await this.postRepository.find({ where: {exercise: exercise, feedOpen: 1} });
      let returnData: { likeArray: number[]; PostData: PostInformation[] } =
        await this.parseReturnData(specificPost, userIndex, userService, likeService);
      if (orderByFlag === 1) returnData.PostData = this.sortByPopularity(returnData.PostData);
      return returnData;
    } catch(e) {
      throw new Error(e);
    }
  }

  public async getMyPost(context: any, userService: any, likeService: any, authService: any)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {

    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];

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

  async addPost(context: any, uploadDate: string, exercise: number, content: string, condition: number, feedOpen: number, authService: any): Promise<boolean> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];
    try {
      await this.postRepository.save(new Post(userIndex, uploadDate, exercise, content, condition, feedOpen).getPostInfo());
      return true;
    } catch(e) {
      throw new Error(e);
    }
  }

  async likePost(context: any, postIndex: number, isDelete: boolean, likeService: any, authService: any): Promise<boolean> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];
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

  // TODO : report 기능 구체화
  public async reporting(context: any, authService: any): Promise<number> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];
    console.info(userIndex);

    return 1;
  }

  public async getMyDate(context: any, authService: any): Promise<string[]> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];
    try {
      return (await this.postRepository.find({ select: ["uploadDate"],
        where: { userIndex: userIndex }
      })).map(node => node.uploadDate);
    } catch (e) {
      throw new Error(e);
    }
  }

  public async modifyPost(context: any, postIndex: number, uploadDate: string, exercise: number, content: string, condition: number, feedOpen: number, authService: any): Promise<boolean> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];
    try {
      await this.postRepository.save({
        postIndex: postIndex, uploadDate: uploadDate, exercise: exercise,
        content: content, condition: condition, feedOpen: feedOpen
      });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async deletePost(context: any, postIndex: number, authService: any): Promise<boolean> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode['userIndex'];
    try {
      await this.postRepository.delete({ postIndex: postIndex });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async deleteUserPost(userIndex: number): Promise<boolean> {
    try {
      await this.postRepository.delete({ userIndex: userIndex });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
