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
      //console.log('data >', data);
      const ranIdx = Math.floor(Math.random() * 3);
      const mentList = data['ment'].split(' , ');
      return { ment: mentList[ranIdx], imgURL: data['imgURL'] };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getUserReport(data: number): Promise<Report> {
    try {
      const test = await this.reportRepository.findOne({reportIndex: 1});
      console.info(test);
      return test;
    } catch (e) {
      throw new Error(e);
    }
  }
}
