import { Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { signupService } from '../services/authService/signup.service';

export const otpController = catchErrors(async (req: Request, res: Response) => {
  res.status(res.statusCode).send();
});
