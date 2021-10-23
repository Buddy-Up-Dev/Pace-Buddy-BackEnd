import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "Post", schema: "Post"})

export class Post {
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

}