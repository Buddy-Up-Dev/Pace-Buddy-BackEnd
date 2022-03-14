import { Injectable } from "@nestjs/common";
import { Exercise } from "./exercise.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ExerciseService {
  constructor(@InjectRepository(Exercise) private exerciseRepository: Repository<Exercise>) {
    this.exerciseRepository = exerciseRepository;
  }

  public async getExercise(): Promise<Exercise[]> {
    try {
      return await this.exerciseRepository.find();
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getExerciseName(exerciseIndex: number): Promise<String> {
    try {
      const data: object = await this.exerciseRepository.findOne({
        select: ["exerciseName"],
        where: { exerciseIndex: exerciseIndex }
      });
      return data["exerciseName"];
    } catch (e) {
      throw new Error(e);
    }
  }
}
