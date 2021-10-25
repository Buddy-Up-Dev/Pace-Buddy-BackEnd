import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name:'User', schema: 'User'})
export class User {
  constructor() {}
  @PrimaryGeneratedColumn() userIndex: number;

  @Column({length: 600}) userName: string;
  @Column({length: 600}) naverID: string;
  @Column({length: 600}) kakaoID: string;

  getUserInfo() {
    return {
      userIndex: this.userIndex,
      userName: this.userName,
      naverID: this.naverID,
      kakaoID: this.kakaoID
    }
  }
}