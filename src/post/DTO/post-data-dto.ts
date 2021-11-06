import { PostData } from "../../graphql";
import { PostInformation } from "../../graphql";

export class PostDataDto extends PostData {
  PostData: PostInformation[];
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