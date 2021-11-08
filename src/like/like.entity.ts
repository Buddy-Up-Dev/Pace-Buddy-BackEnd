import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "Like", schema: "Like"})

export class Like {
  constructor(userIndex: number, postIndex: number) {
    this.userIndex = userIndex;
    this.postIndex = postIndex;
  }
  @PrimaryGeneratedColumn()
  likeIndex: number;

  @Column()
  userIndex: number;

  @Column()
  postIndex: number;

  getLikeInfo(): object{
    return {userIndex: this.userIndex, postIndex: this.postIndex};
  }
}