import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseResolver } from './exercise.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exercise } from "./exercise.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  providers: [ExerciseService, ExerciseResolver]
})
export class ExerciseModule {}
