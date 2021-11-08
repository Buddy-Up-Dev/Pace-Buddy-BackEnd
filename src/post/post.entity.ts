import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('Post')
export class Post {
  constructor(userIndex: number, uploadData) {
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
}