import SmsInterface from './sms.interface';
import { Inject, Logger } from '@nestjs/common';

const request = require('request');

export default class SmsService implements SmsInterface {
  private logger = new Logger('SMSService');

  async sendMessage(to, message): Promise<void> {
    request.post(
      {
        url: 'http://ippanel.com/api/select',
        form: {
          op: 'send',
          uname: 'uname',
          pass: 'pass',
          message: message,
          to: [to],
          from: '',
        },
      },
      (err, httpResponse, body) => {
        if (err != null)
          this.logger.error(
            `There is a problem to send message: ${err}`,
            err.stack,
          );
      },
    );
  }
}
