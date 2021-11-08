import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('Post')
export class Post {
  constructor(_userIndex: number, _uploadData: string, _exercise: number,
    _content: string, _condition: number, _feedOpen: number) {
    this.userIndex = _userIndex;
    this.uploadDate = _uploadData;
    this.exercise = _exercise;
    this.content = _content;
    this.condition = _condition;
    this.feedOpen = _feedOpen;
  }
  @PrimaryGeneratedColumn()
  postIndex: number;

  @Column()
  userIndex: number;

  @Column()
  uploadDate: string;

  @Column()
  exercise: number;

  @Column({length: 300})
  content: string;

  @Column()
  condition: number;

  @Column()
  feedOpen: number;

  public getPostInfo(): object {
    return {
      userIndex: this.userIndex,
      uploadDate: this.uploadDate,
      exercise: this.exercise,
      content: this.content,
      condition: this.condition,
      feedOpen: this.feedOpen
    }
  }


}