import { Resolver, Query, Context } from "@nestjs/graphql";
import { ExerciseService } from "./exercise.service";

@Resolver()
export class ExerciseResolver {
  constructor(private exerciseService: ExerciseService) {}

  @Query('getExercise')
  async getExercise(@Context() context: object):
    Promise<{ Index: number[]; Name: string[] }> {
    return await this.exerciseService.getExercise(context);
  }

}
