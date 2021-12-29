import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Post } from "./post.entity";
import { Like } from "../like/like.entity";
import { PostDataDto } from "./DTO/post-data-dto";
import { PostInformation, ReportData } from "../graphql";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {
    this.postRepository = postRepository;
  }

  public async parseBearerToken(context, authService): Promise<number> {
    const req: string = context["req"]["headers"]["authorization"];
    const PARSE_BEARER_INDEX = 7;
    if (req !== undefined) {
      const decode: string = await authService["decodeToken"](req.substr(PARSE_BEARER_INDEX, req.length - PARSE_BEARER_INDEX));
      return decode["userIndex"];
    } else {
      return -1;
    }
  }

  public async getAllLatestPost(context: object, orderByFlag: number, userService: object, likeService: object, authService: object)
    : Promise<{ likeArray: number[]; PostData: PostInformation[] }> {
    const userIndex: number = await this.parseBearerToken(context, authService)
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
    const PARSE_INDEX = 7;
    const userIndex: number = await this.parseBearerToken(context, authService);
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
    const userIndex: number = await this.parseBearerToken(context, authService);
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
        User: await userService["getUser"](node.userIndex),
        Like: await likeService["getLikeByPost"](node.postIndex)
      });
      node.uploadDate = JSON.stringify(node.uploadDate).slice(6, 8) + "." + JSON.stringify(node.uploadDate).slice(9, 11);
    }
    const returnLike = await this.getLikeCount(userIndex, likeService);
    const getPostData: PostDataDto = new PostDataDto(returnData, returnLike);
    return getPostData.getPostData();
  }

  private sortByPopularity(data): PostDataDto["PostData"] {
    return data.sort((a, b) => {
      return parseFloat(b.Like) - parseFloat(a.Like);
    });
  }

  public async addPost(context: object, uploadDate: string, exercise: number, content: string,
                       condition: number, feedOpen: number, authService: object): Promise<boolean> {
    const userIndex: number = await this.parseBearerToken(context, authService);
    try {
      await this.postRepository.save(new Post(userIndex, uploadDate, exercise, content, condition, feedOpen).getPostInfo());
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async likePost(context: object, postIndex: number, isDelete: boolean,
                        likeService: object, authService: object): Promise<boolean> {
    const userIndex: number = await this.parseBearerToken(context, authService);
    try {
      if (isDelete) {
        await likeService["deleteLike"](postIndex, userIndex);
        return true;
      } else {
        await likeService["addLike"](postIndex, userIndex);
        return true;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getLikeCount(userIndex: number, likeService: object): Promise<number[]> {
    const likeArray: Like[] = await likeService["getLikeByUser"](userIndex);
    return likeArray.map(node => node.postIndex);
  }

  public async reporting(context: object, authService: object, reportService: object, exerciseService: object): Promise<ReportData> {
    const userIndex: number = await this.parseBearerToken(context, authService);
    const MINIMUM_NUMBER_POSTS = 5;
    const posts: Post[] = await this.postRepository.find({
      select: ["condition", "exercise", "uploadDate"],
      where: { userIndex: userIndex },
      order: { uploadDate: "DESC" },
      take: 10
    });

    if (posts.length < MINIMUM_NUMBER_POSTS) {
      return { reportExist: false };
    }

    const postData: object = await this.getReportData(posts);
    const condition: object = await reportService["getReportData"](postData["condition"]);
    const exercise: string = await exerciseService["getExerciseName"](postData["exerciseIndex"]);
    const date: boolean = await this.getDateData(postData["date"]);
    const exerciseType: string = date === true ? "성실하게 꼬박꼬박 하는 편이에요." : "지치지 않고 찬찬히 하는 편이에요.";

    return {
      reportExist: true,
      conditionMent: condition["ment"],
      conditionImgURL: condition["imgURL"],
      exerciseName: exercise,
      exerciseType: exerciseType
    };
  }

  public async getReportData(posts: Post[]): Promise<object> {
    const condition: string = (posts.reduce((acc, x) => acc + x.condition, 0) / 10).toFixed();
    const exercise = posts.map(node => node.exercise).reduce((acc, x) => {
      acc[x]++;
      return acc;
    }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    let mostExercise = exercise[0];
    let exerciseIndex = null;

    const EXERCISE_TOTAL_NUMBER = 12;
    for (let i = 1; i < EXERCISE_TOTAL_NUMBER; i++) {
      if (exercise[i] > mostExercise) {
        mostExercise = exercise[i];
        exerciseIndex = i;
      }
    }

    const date: object = posts.map(node => node.uploadDate).reverse();
    return { condition: condition, exerciseIndex: exerciseIndex, date: date };
  }

  private getDateData(dateList: string[]): boolean {
    let count = 1;
    const newDateList: Date[] = this.stringToDate(dateList);

    for (let i = 0; i < newDateList.length - 1; i++) {
      if (Math.ceil((newDateList[i + 1].getTime() - newDateList[i].getTime()) / (1000 * 3600 * 24)) <= 2) count++;
      else count = 1;
    }
    return count >= 5;
  }

  private stringToDate(dateList: string[]): Date[] {
    return dateList.map(date =>
      new Date(Number(date.split(".")[0]), Number(date.split(".")[1]) - 1, Number(date.split(".")[2]) + 1)
    );
  }

  public async getMyDate(context: object, authService: object): Promise<string[]> {
    const userIndex: number = await this.parseBearerToken(context, authService);
    try {
      return (await this.postRepository.find({
        select: ["uploadDate"],
        where: { userIndex: userIndex }
      })).map(node => node.uploadDate);
    } catch (e) {
      throw new Error(e);
    }
  }

  public async modifyPost(context: object, postIndex: number, uploadDate: string,
                          exercise: number, content: string, condition: number, feedOpen: number, authService: object): Promise<boolean> {
    const userIndex: number = await this.parseBearerToken(context, authService);
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
    const userIndex: number = await this.parseBearerToken(context, authService);
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