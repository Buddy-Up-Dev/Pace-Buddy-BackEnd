import { Injectable } from '@nestjs/common';
import { Report } from "./report.entity"
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) {
    this.reportRepository = reportRepository;
  }

  public async getReportData(condition: number): Promise<object> {
    try {
      const data = await this.reportRepository.findOne({
        select: ['ment', 'imgURL'],
        where: {condition: condition},
      })
      const ranIdx = Math.floor(Math.random() * 3);
      const mentList = data['ment'].split(' , ');
      return { ment: mentList[ranIdx], imgURL: data['imgURL'] };
    } catch (e) {
      throw new Error(e);
    }
  }
}
