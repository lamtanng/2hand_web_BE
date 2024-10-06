import { Request, Response } from 'express';
import { ReportModel } from '../models/report';
import { ReportDocument } from '../models/report/report.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const reports = await ReportModel.find({});
    return { reports };
  } catch (error) {
    console.error(error);
  }
};

const addReport = async (reqBody: ReportDocument, res: Response) => {
  try {
    const report = reqBody;

    const newReport = await ReportModel.create(report);
    return { newReport };
  } catch (error) {
    console.error(error);
  }
};

export const reportService = { findAll, addReport };
