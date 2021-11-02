
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export abstract class IQuery {
    __typename?: 'IQuery';

    abstract getAllLatestPost(flag: number): PostData | Promise<PostData>;

    abstract getSpecificExercise(flag: number, exercise: number): PostData | Promise<PostData>;

    abstract getMyPost(): PostData | Promise<PostData>;

    abstract getExercise(): Exercise | Promise<Exercise>;

    abstract userQuery(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract postQuery(test: number, test_: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract userMutation(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract postMutation(): Nullable<boolean> | Promise<Nullable<boolean>>;
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
    User: User;
    Like: number;
}

export class Exercise {
    __typename?: 'Exercise';
    Index: Nullable<number>[];
    Name: Nullable<string>[];
}

export class User {
    __typename?: 'User';
    userIndex: number;
    userName: string;
    naverID?: Nullable<string>;
    kakaoID?: Nullable<string>;
}

type Nullable<T> = T | null;
