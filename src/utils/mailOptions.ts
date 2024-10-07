import Mail, { Address } from 'nodemailer/lib/mailer';
import { env } from '../config/environment';
import { EmailType } from '../types/enum/emailType.enum';

interface MailOptions {
  to: string | Address | Array<string | Address> | undefined;
  OTPCode: number;
  type: EmailType;
}

const getMailOptions = ({ to, type, OTPCode }: MailOptions): Mail.Options => ({
  from: { name: env.APP_NAME, address: env.EMAIL_ADDRESS },
  to,
  subject: type,
  text: `Your code: ${OTPCode}`,
  html: `Your code: ${OTPCode}`,
});

const getEmailOptions =
  (type: EmailType) =>
  ({ to, OTPCode }: Pick<MailOptions, 'to' | 'OTPCode'>) =>
    getMailOptions({ to, type, OTPCode });

export const mailOptions = {
  getEmailVerificationOptions: getEmailOptions(EmailType.EmailVerification),
  getResetPasswordOptions: getEmailOptions(EmailType.ResetPassword),
};
