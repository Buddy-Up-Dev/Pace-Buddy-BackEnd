
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export abstract class IQuery {
    __typename?: 'IQuery';

    abstract getAllLatestPost(flag: number, offset?: Nullable<number>): PostData | Promise<PostData>;

    abstract getSpecificExercise(flag: number, exercise: number, offset?: Nullable<number>): PostData | Promise<PostData>;

    abstract getMyPost(): PostData | Promise<PostData>;

    abstract getExercise(): Nullable<Exercise>[] | Promise<Nullable<Exercise>[]>;

    abstract reporting(): ReportData | Promise<ReportData>;

    abstract getMyDate(): Nullable<string[]> | Promise<Nullable<string[]>>;

    abstract userNickname(): string | Promise<string>;

    abstract hasProfile(): ProfileData | Promise<ProfileData>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract naverLogin(accessToken: string): string | Promise<string>;

    abstract kakaoLogin(accessToken: string): string | Promise<string>;

    abstract addPost(uploadDate: string, exercise: number, content: string, condition: number, feedOpen: number): boolean | Promise<boolean>;

    abstract modifyPost(postIndex: number, uploadDate: string, exercise: number, content: string, condition: number, feedOpen: number): boolean | Promise<boolean>;

    abstract deletePost(postIndex: number): boolean | Promise<boolean>;

    abstract likePost(postIndex: number, isDelete?: Nullable<boolean>): boolean | Promise<boolean>;

    abstract deleteUser(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract initData(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract uploadProfile(imgURL: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export class Post {
    __typename?: 'Post';
    postIndex: number;
    userIndex: number;
    uploadDate: string;
    exercise: number;
    content: string;
    condition: number;
    feedOpen?: Nullable<number>;
}

export class PostData {
    __typename?: 'PostData';
    PostData: Nullable<PostInformation>[];
    likeArray?: Nullable<number[]>;
}

export class PostInformation {
    __typename?: 'PostInformation';
    Post: Post;
    User?: Nullable<User>;
    Like?: Nullable<number>;
}

export class Exercise {
    __typename?: 'Exercise';
    exerciseIndex: number;
    exerciseName: string;
}

export class ReportData {
    __typename?: 'ReportData';
    reportExist: boolean;
    conditionMent?: Nullable<string>;
    conditionImgURL?: Nullable<string>;
    exerciseName?: Nullable<string>;
    exerciseType?: Nullable<string>;
}

export class ProfileData {
    __typename?: 'ProfileData';
    hasProfile: boolean;
    imgURL: string;
}

export class User {
    __typename?: 'User';
    userIndex?: Nullable<number>;
    userName?: Nullable<string>;
    naverID?: Nullable<string>;
    kakaoID?: Nullable<string>;
}

type Nullable<T> = T | null;
