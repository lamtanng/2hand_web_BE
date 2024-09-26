import { Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { StatusCodes } from 'http-status-codes';
import { signupService } from '../services/signup.service';

// post
const signup = catchErrors(async (req: Request, res: Response) => {
  const signup = await signupService.signup(req.body);
  res.status(StatusCodes.OK).json(signup).send();
});

export const signupController = {
  signup,
};
