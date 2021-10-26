import { PostData } from "../../graphql";
import { PostInfomation } from "../../graphql";

export class PostDataDto extends PostData {
  PostData: PostInfomation[];
  likeArray: number[];
  constructor(post, like) {
    super();
    this.PostData = post;
    this.likeArray = like;
  }

  getPostData() {
    return {
      PostData: this.PostData,
      likeArray: this.likeArray
    }
  }
}