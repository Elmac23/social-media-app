import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export const EMAIL_TEMPLATES = {
  CONFIRM_EMAIL: { subject: 'Confirm Email', template: 'welcome' },
  RESET_PASSWORD: { subject: 'Reset Password', template: 'reset-password' },
  CONFIRM_DEVICE: { subject: 'Confirm Device', template: 'confirm-device' },
} as const;

@Injectable({})
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    to: string,
    type: keyof typeof EMAIL_TEMPLATES,
    context: unknown,
  ) {
    const { subject, template } = EMAIL_TEMPLATES[type];

    await this.mailerService.sendMail({
      to,
      subject: `Friendsy - ${subject}`,
      template,
      context,
    });
  }
}
