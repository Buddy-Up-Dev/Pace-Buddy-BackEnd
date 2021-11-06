import { Resolver, Query, Context } from "@nestjs/graphql";
import { ExerciseService } from "./exercise.service";
import { Exercise } from "./exercise.entity";

@Resolver()
export class ExerciseResolver {
  constructor(private exerciseService: ExerciseService) {}

  @Query('getExercise')
  async getExercise(@Context() context: object):
    Promise<Exercise[]> {
    return await this.exerciseService.getExercise(context);
  }

}
