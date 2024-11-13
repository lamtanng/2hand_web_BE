import { axiosClient } from '../config/axios';

export interface SendOTPSmsAPIProps {
  phoneNumber: string;
  otp: number;
}
export function sendOTPSms(data: SendOTPSmsAPIProps) {
  const url = 'https://trigger.macrodroid.com/b2f6dba8-04c0-400d-9d19-74411af33090/2handweb.phone';
  return axiosClient.post(url, {}, { params: data });
}
