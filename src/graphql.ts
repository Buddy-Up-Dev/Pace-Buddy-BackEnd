
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

    abstract getExercise(): Nullable<Exercise>[] | Promise<Nullable<Exercise>[]>;

    abstract reporting(): number | Promise<number>;

    abstract userQuery(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract postQuery(test: number, test_: string): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract testORM(): Nullable<Nullable<Post>[]> | Promise<Nullable<Nullable<Post>[]>>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract addPost(uploadDate: string, exercise: number, content: string, condition: number, feedOpen: number): boolean | Promise<boolean>;

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
    exerciseIndex: number;
    name: string;
}

export class User {
    __typename?: 'User';
    userIndex: number;
    userName: string;
    naverID?: Nullable<string>;
    kakaoID?: Nullable<string>;
}

type Nullable<T> = T | null;
