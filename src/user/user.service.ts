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

  public async getUserNickname(context: object, authService: object): Promise<string> {
    const userIndex = await this.getUserIndex(context, authService);

    const data: object = await this.userRepository.findOne({
      select: ['userName'],
      where: { userIndex: userIndex }
    });

    return data['userName'];
  }

  public async checkNewUser(userID: string, loginType: string): Promise<object> {
    if (loginType === 'naver') {
      try {
        const [data] = await this.userRepository.find({
          select: ['userIndex'],
          where: { naverID: userID }
        });
        // 이미 가입한 유저
        if (data !== undefined) {
          return { status: 'login', userIndex: data.userIndex };
        }
        // 새로 가입하는 유저
        else {
          const userIndex = await this.addNewUser(userID, loginType);
          return { status: 'join', userIndex: userIndex };
        }
      } catch (e) {
        throw new Error(e);
      }
    } else if (loginType === 'kakao') {
      try {
        const [data] = await this.userRepository.find({
          select: ['userIndex'],
          where: { kakaoID: userID }
        });
        // 이미 가입한 유저
        if (data !== undefined) {
          return { status: 'login', userIndex: data.userIndex };
        }
        // 새로 가입하는 유저
        else {
          const userIndex = await this.addNewUser(userID, loginType);
          return { status: 'join', userIndex: userIndex };
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  public async addNewUser(userID, loginType): Promise<number> {
    try {
      if (loginType === 'naver') {
        const newName = this.makeDefaultName();
        const newUser = await this.userRepository.save({
          userName: await this.makeDefaultName(),
          naverID: userID
        });
        return newUser.userIndex;
      } else if (loginType === 'kakao') {
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
    const ASCII_ALPHABET: number = 65;
    const buddy: string = '버디';
    let alpha: number = ASCII_ALPHABET;
    const newUserIdx: number = await this.userRepository.count() + 1;

    if (newUserIdx < 10) {
      return buddy.concat(String.fromCharCode(alpha).concat('00', String(newUserIdx)));
    } else if (newUserIdx < 100) {
      return buddy.concat(String.fromCharCode(alpha).concat('0', String(newUserIdx)));
    } else {
      return buddy.concat(String.fromCharCode(alpha).concat(String(newUserIdx)));
    }
  }

  public async deleteUser(context: object, postService: object, likeService: object, authService: object): Promise<boolean> {
    const userIndex = await this.getUserIndex(context, authService);

    try {
      // User 테이블에서 삭제
      await this.userRepository.delete({ userIndex: userIndex });
      // Post 테이블에서 해당 User 글 삭제
      await postService['deleteUserPost'](userIndex);
      // Like 테이블에서 해당 User 좋아요 삭제 ()
      await likeService['deleteUserLike'](userIndex);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async uploadProfile(context: object, imgURL: string, authService: object) {
    const userIndex = await this.getUserIndex(context, authService);

    try {
      const currUser: object = await this.userRepository.findOne({ where: { userIndex: userIndex } });
      currUser['profileImgURL'] = imgURL;
      await this.userRepository.save(currUser);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getProfileInfo(context: object, authService: object) {
    const userIndex = await this.getUserIndex(context, authService);

    try {
      const info: object = await this.userRepository.findOne({
        select: ['profileImgURL'],
        where: { userIndex: userIndex }
      });
      if (info['profileImgURL']) {
        return {
          hasProfile: true,
          imgURL: info['profileImgURL']
        };
      } else {
        return {
          hasProfile: false,
          imgURL: 'none'
        };
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  private async getUserIndex(context: object, authService: object): Promise<number> {
    const req: string = context['req']['headers']['authorization'];
    const token: string = req.substr(7, req.length - 7);
    const decode: object = await authService['decodeToken'](token);
    return decode['userIndex'];
  }
}