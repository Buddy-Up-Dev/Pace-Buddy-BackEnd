import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "Like", schema: "Like"})

export class Like {
  @PrimaryGeneratedColumn()
  likeIndex: number;

  @Column()
  userIndex: number;

  @Column()
  postIndex: number;
}