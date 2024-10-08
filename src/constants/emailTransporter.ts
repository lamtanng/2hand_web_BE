import nodemailer from 'nodemailer';
import { env } from '../config/environment';

export const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: env.EMAIL_HOST,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: env.EMAIL_ADDRESS,
    pass: env.EMAIL_PASSWORD,
  },
});
