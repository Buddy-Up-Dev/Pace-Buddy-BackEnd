import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "Like", schema: "Like"})

export class Like {
  constructor(_userIndex: number, _postIndex: number) {
    this.userIndex = _userIndex;
    this.postIndex = _postIndex;
  }
  @PrimaryGeneratedColumn()
  likeIndex: number;

  @Column()
  userIndex: number;

  @Column()
  postIndex: number;

  public getLikeInfo(): object{
    return {userIndex: this.userIndex, postIndex: this.postIndex};
  }
}