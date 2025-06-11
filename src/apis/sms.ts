import { axiosClient } from '../config/axios';

export interface SendOTPSmsAPIProps {
  phoneNumber: string;
  otp: number;
}
export function sendOTPSms(data: SendOTPSmsAPIProps) {
  const url = `https://trigger.macrodroid.com/426ea743-6e1d-4c52-a41d-56090e9acc7f/send_sms?phoneNumber=${data.phoneNumber}&otp=${data.otp}`;
  return axiosClient.post(url, {}, { params: data });
}
