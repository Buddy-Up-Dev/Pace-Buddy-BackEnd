import { Injectable } from '@nestjs/common';
import { Exercise } from "./exercise.entity";
import { getRepository } from "typeorm";

@Injectable()
export class ExerciseService {

  public async getExercise(context: object): Promise<{ Index: number[]; Name: string[] }> {
    try {
      const exercise: Exercise[] = await getRepository(Exercise)
        .createQueryBuilder('e').select(['e.exerciseIndex', 'e.exerciseName']).getMany();
      const exerciseIndex: number[] = [];
      const name: string[] = [];
      for (const node of exercise) {
        exerciseIndex.push(node.exerciseIndex);
        name.push(node.exerciseName);
      }
      return { Index: exerciseIndex, Name: name };
    } catch(e) {
      throw new Error(e);
    }
  }

}
