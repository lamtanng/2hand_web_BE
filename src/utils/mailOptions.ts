import Mail, { Address } from 'nodemailer/lib/mailer';
import { env } from '../config/environment';
import { EmailType } from '../types/enum/emailType.enum';

interface MailOptions {
  to: string | Address | Array<string | Address> | undefined;
  OTPCode?: number;
  resetUrl?: string;
  type: EmailType;
}

const getMailOptions = ({ to, type, OTPCode, resetUrl }: MailOptions): Mail.Options => ({
  from: { name: env.APP_NAME, address: env.EMAIL_ADDRESS },
  to,
  subject: type,
  text: `Your code: ${OTPCode}`,
  html: `${
    type === EmailType.EmailVerification
      ? `Your code: ${OTPCode}`
      : `Click this link to reset password: ${resetUrl}`
  } `,
});

const getEmailOptions = (type: EmailType) =>
  type === EmailType.EmailVerification
    ? ({ to, OTPCode }: Pick<MailOptions, 'to' | 'OTPCode'>) =>
        getMailOptions({ to, type, OTPCode })
    : ({ to, resetUrl }: Pick<MailOptions, 'to' | 'resetUrl'>) =>
        getMailOptions({ to, type, resetUrl });

export const mailOptions = {
  getEmailVerificationOptions: getEmailOptions(EmailType.EmailVerification),
  getResetPasswordOptions: getEmailOptions(EmailType.ResetPassword),
};
