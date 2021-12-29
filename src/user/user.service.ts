import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    this.userRepository = userRepository;
  }

  public async getUser(userIndex: number): Promise<object> {
    return this.userRepository.findOne({ userIndex: userIndex });
  }

  public async getUserNickname(context: any, authService: any): Promise<string> {
    const req = context.req.headers.authorization;
    const token = req.substr(7, req.length - 7);
    const decode = await authService.decodeToken(token);
    const userIndex = decode["userIndex"];

    const [data] = await this.userRepository.find({
      select: ["userName"],
      where: { userIndex: userIndex }
    });
    return data.userName;
  }

  public async checkNewUser(userID: string, loginType: string): Promise<object> {
    if (loginType === "naver") {
      try {
        const [data] = await this.userRepository.find({
          select: ["userIndex"],
          where: { naverID: userID }
        });
        // 이미 가입한 유저
        if (data !== undefined) {
          return { status: "login", userIndex: data.userIndex };
        }
        // 새로 가입하는 유저
        else {
          const userIndex = await this.addNewUser(userID, loginType);
          return { status: "join", userIndex: userIndex };
        }
      } catch (e) {
        throw new Error(e);
      }
    } else if (loginType === "kakao") {
      try {
        const [data] = await this.userRepository.find({
          select: ["userIndex"],
          where: { kakaoID: userID }
        });
        // 이미 가입한 유저
        if (data !== undefined) {
          return { status: "login", userIndex: data.userIndex };
        }
        // 새로 가입하는 유저
        else {
          const userIndex = await this.addNewUser(userID, loginType);
          return { status: "join", userIndex: userIndex };
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  public async addNewUser(userID, loginType): Promise<number> {
    try {
      if (loginType === "naver") {
        const newName = this.makeDefaultName();
        const newUser = await this.userRepository.save({
          userName: await this.makeDefaultName(),
          naverID: userID
        });
        return newUser.userIndex;
      } else if (loginType === "kakao") {
        const newName = this.makeDefaultName();
        const newUser = await this.userRepository.save({
          userName: await this.makeDefaultName(),
          kakaoID: userID
        });
        return newUser.userIndex;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  public async makeDefaultName(): Promise<string> {
    const buddy = "버디";
    let alpha = 65;
    let nick;
    const newUserIdx = await this.userRepository.count() + 1;

    if (newUserIdx < 10) {
      nick = String.fromCharCode(alpha).concat("00", String(newUserIdx));
    } else if (newUserIdx < 100) {
      nick = String.fromCharCode(alpha).concat("0", String(newUserIdx));
    } else {
      nick = String.fromCharCode(alpha).concat(String(newUserIdx));
    }
    return buddy.concat(nick);
  }

  // TODO : JWT LOGIC
  public async deleteUser(context: any, postService: any, likeService: any, authService: any): Promise<boolean> {
    // const req = context.req.headers.authorization;
    // const token = req.substr(7, req.length - 7);
    // const decode = await authService.decodeToken(token);
    // const userIndex = decode['userIndex'];
    const userIndex = 18;

    try {
      // User 테이블에서 삭제
      await this.userRepository.delete({ userIndex: userIndex });
      // Post 테이블에서 해당 User 글 삭제
      await postService.deleteUserPost(userIndex);
      // Like 테이블에서 해당 User 좋아요 삭제 ()
      await likeService.deleteUserLike(userIndex);

      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async uploadProfile(context: object, imgURL: string, authService: object) {
    const req = context["req"]["headers"]["authorization"];
    const token = req.substr(7, req.length - 7);
    const decode = await authService["decodeToken"](token);
    const userIndex = decode["userIndex"];
    try {
      const currUser = await this.userRepository.findOne({ where: { userIndex: userIndex } });
      currUser["profileImgURL"] = imgURL;
      await this.userRepository.save(currUser);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getProfileInfo(context: object, authService: object) {
    const req = context["req"]["headers"]["authorization"];
    const token = req.substr(7, req.length - 7);
    const decode = await authService["decodeToken"](token);
    const userIndex = decode["userIndex"];
    try {
      const info = await this.userRepository.findOne({
        select: ["profileImgURL"],
        where: { userIndex: userIndex }
      });
      if (info["profileImgURL"]) {
        return {
          hasProfile: true,
          imgURL: info["profileImgURL"]
        };
      } else {
        return {
          hasProfile: false,
          imgURL: "none"
        };
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}