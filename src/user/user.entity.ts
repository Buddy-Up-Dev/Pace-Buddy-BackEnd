import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name:'User', schema: 'User'})
export class User {
  @PrimaryGeneratedColumn() userIndex: number;

  @Column({length: 600}) userName: string;
  @Column({length: 600}) naverID: string;
  @Column({length: 600}) kakaoID: string;
}