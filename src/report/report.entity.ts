import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('Report')
export class Report {
  @PrimaryGeneratedColumn()
  reportIndex: number

  @Column()
  condition: number

  @Column()
  ment: string

  @Column()
  imgURL: string
}