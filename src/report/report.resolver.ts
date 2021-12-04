import {Context, Query, Resolver} from '@nestjs/graphql';
import { ReportService } from "./report.service";
import { AuthService } from "../auth/auth.service";


@Resolver()
export class ReportResolver {
  constructor(private reportService: ReportService) {}
}
