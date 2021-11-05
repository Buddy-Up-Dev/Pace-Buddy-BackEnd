import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Exercise")
export class Exercise {
  @PrimaryGeneratedColumn()
  exerciseIndex: number;

  @Column({length: 45})
  exerciseName: string;
}