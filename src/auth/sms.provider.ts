import SmsInterface from './sms.interface';

export class SmsProvider implements SmsInterface {
  async sendMessage(to, message): Promise<void> {
    return;
  }
}
