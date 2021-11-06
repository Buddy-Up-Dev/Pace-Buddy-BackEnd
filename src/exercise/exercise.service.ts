import { Injectable } from "@nestjs/common";
import { Exercise } from "./exercise.entity";
import { getRepository, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ExerciseService {
  constructor(@InjectRepository(Exercise) private exerciseRepository: Repository<Exercise>) {
    this.exerciseRepository = exerciseRepository;
  }

  public async getExercise(context: object): Promise<Exercise[]> {
    try {
      // const exercise = await this.exerciseRepository.find();

      // const exerciseIndex: number[] = [];
      // const name: string[] = [];
      // for (const node of exercise) {
      //   exerciseIndex.push(node.exerciseIndex);
      //   name.push(node.exerciseName);
      // }

      const res =  await this.exerciseRepository.find();
      console.info(res);
      return res;
      // return await getRepository(Exercise)
      //   .createQueryBuilder('e').select(['e.exerciseIndex', 'e.exerciseName']).getMany()

    } catch(e) {
      throw new Error(e);
    }
  }
}
