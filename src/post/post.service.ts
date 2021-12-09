import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { Post } from "./post.entity";
import { Like } from "../like/like.entity";

import { PostDataDto } from "./DTO/post-data-dto";
import { PostInformation } from "../graphql";

import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {
    this.postRepository = postRepository;
  }

  public async getAllLatestPost(context: object, orderByFlag: number, userService: object, likeService: object, authService: object)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {

    let userIndex = -1;
    const req = context['req']['headers']['authorization'];
    if (req !== undefined) {
      const token = req.substr(7, req.length - 7);
      const decode = await authService['decodeToken'](token);
      userIndex = decode['userIndex'];
      console.info(userIndex);
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

  public async getSpecificExercise(context: object, orderByFlag: number, exercise: number,
                                   userService: object, likeService: object, authService: object)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {

    let userIndex = -1;
    const req = context['req']['headers']['authorization'];
    console.info(req);
    if (req !== undefined) {
      const token = req.substr(7, req.length - 7);
      const decode = await authService['decodeToken'](token);
      userIndex = decode['userIndex'];
      console.info(userIndex);
    }

    try {
      const specificPost: Post[] = await this.postRepository.find({ where: { exercise: exercise, feedOpen: 1 } });
      let returnData: { likeArray: number[]; PostData: PostInformation[] } =
        await this.parseReturnData(specificPost, userIndex, userService, likeService);

      if (orderByFlag === 1) returnData.PostData = this.sortByPopularity(returnData.PostData);

      return returnData;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getMyPost(context: object, userService: object, likeService: object, authService: object)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {

    const req = context['req']['headers']['authorization'];
    const token = req.substr(7, req.length - 7);
    const decode = await authService['decodeToken'](token);
    const userIndex = decode["userIndex"];

    try {
      const allMyPost: Post[] = await this.postRepository.find({ where: { userIndex: userIndex, feedOpen: 1 } });
      return await this.parseReturnData(allMyPost, userIndex, userService, likeService);
    } catch (e) {
      throw new Error("Error: " + e);
    }
  }

  private async parseReturnData(data: Post[], userIndex: number, userService: object, likeService: object):
    Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    const returnData: object[] = [];
    for (const node of data) {
      returnData.push({
        Post: node,
        User: await userService['getUser'](node.userIndex),
        Like: await likeService['getLikeByPost'](node.postIndex)
      });
      node.uploadDate = JSON.stringify(node.uploadDate).slice(6, 8) + "." + JSON.stringify(node.uploadDate).slice(9, 11);
    }
    const returnLike = await this.getLikeCount(userIndex, likeService);
    const getPostData: PostDataDto = new PostDataDto(returnData, returnLike);
    return getPostData.getPostData();
  }

  private sortByPopularity(data): PostDataDto['PostData'] {
    console.info(data);
    return data.sort((a, b) => {
      return parseFloat(b.Like) - parseFloat(a.Like);
    });
  }

  public async addPost(context: object, uploadDate: string, exercise: number, content: string,
                       condition: number, feedOpen: number, authService: object): Promise<boolean> {
    const req = context['req']['headers']['authorization'];
    const token = req.substr(7, req.length - 7);
    const decode = await authService['decodeToken'](token);
    const userIndex = decode['userIndex'];
    try {
      await this.postRepository.save(new Post(userIndex, uploadDate, exercise, content, condition, feedOpen).getPostInfo());
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async likePost(context: object, postIndex: number, isDelete: boolean,
                        likeService: object, authService: object): Promise<boolean> {
    const req = context['req']['headers']['authorization'];
    const token = req.substr(7, req.length - 7);
    const decode = await authService['decodeToken'](token);
    const userIndex = decode['userIndex'];
    try {
      if (isDelete) {
        await likeService['deleteLike'](postIndex, userIndex);
        return true;
      } else {
        await likeService['addLike'](postIndex, userIndex);
        return true;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getLikeCount(userIndex: number, likeService: object): Promise<number[]> {
    const likeArray: Like[] = await likeService['getLikeByUser'](userIndex);
    return likeArray.map(node => node.postIndex);
  }

  // TODO : report 기능 구체화
  public async reporting(context: object, authService: object, reportService: object, exerciseService: object): Promise<number> {
    const req = context['req']['headers']['authorization'];
    const token: string = req.substr(7, req.length - 7);
    const decode: object = await authService['decodeToken'](token);
    const userIndex: number = decode['userIndex'];

    // 유저의 최근 5개 기록 조회
    const posts: Post[] = await this.postRepository.find({
      select: ['condition', 'exercise', 'uploadDate'],
      where: { userIndex: userIndex },
      order: { uploadDate: 'DESC' },
      take: 10
    });

    const returnData: object = await this.getReportData(posts);
    const condition = await reportService['getReportData'](returnData['condition']);
    const exercise = await exerciseService['getExerciseName'](returnData['exerciseIndex']);
    const date = await this.getDateData(returnData['date']);

    console.log('condition >', condition);
    console.log('exercise >', exercise);
    console.log('date >', date);

    return 1;
  }

  public async getReportData(posts: Post[]): Promise<object> {
    const condition = (posts.reduce((acc, x) => acc + x.condition, 0) / 10).toFixed();
    const exercise = posts.map(node => node.exercise).reduce((acc, x) => {
      acc[x]++;
      return acc;
    }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    let mostExercise = exercise[0];
    let exerciseIndex = null;

    for (let i = 1; i < 12; i++) {
      if (exercise[i] > mostExercise) {
        mostExercise = exercise[i];
        exerciseIndex = i;
      }
    }

    const date = posts.map(node => node.uploadDate).reverse();

    return { condition: condition, exerciseIndex: exerciseIndex, date: date }
  }

  private getDateData(dateList: string[]): string {
    const newDateList: Date[] = this.stringToDate(dateList);
    // TODO : newDateList의 요소 간 날짜 차이 구하기
    console.log('newDateList >', newDateList);
    console.log('날짜 차이 test >', newDateList[1].getDate() - newDateList[0].getDate());
    return 'a';
  }

  private stringToDate(dateList: string[]): Date[] {
    return dateList.map(date =>
        new Date(Number(date.split('.')[0]), Number(date.split('.')[1]) - 1, Number(date.split('.')[2]))
    );
  }

  public async getMyDate(context: object, authService: object): Promise<string[]> {
    const req = context['req']['headers']['authorization'];
    const token = req.substr(7, req.length - 7);
    const decode = await authService['decodeToken'](token);
    const userIndex = decode['userIndex'];
    try {
      return (await this.postRepository.find({
        select: ['uploadDate'],
        where: { userIndex: userIndex }
      })).map(node => node.uploadDate);
    } catch (e) {
      throw new Error(e);
    }
  }

  public async modifyPost(context: object, postIndex: number, uploadDate: string,
                          exercise: number, content: string, condition: number, feedOpen: number, authService: object): Promise<boolean> {
    const req = context['req']['headers']['authorization'];
    const token = req.substr(7, req.length - 7);
    const decode = await authService['decodeToken'](token);
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

  public async deletePost(context: object, postIndex: number, authService: object): Promise<boolean> {
    const req = context['req']['headers']['authorization'];
    const token = req.substr(7, req.length - 7);
    const decode = await authService['decodeToken'](token);
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