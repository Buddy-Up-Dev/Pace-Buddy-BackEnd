import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('User')
export class User {
  constructor() {}
  @PrimaryGeneratedColumn() userIndex: number;

  @Column({length: 600}) userName: string;
  @Column({length: 600}) naverID: string;
  @Column({length: 600}) kakaoID: string;

}