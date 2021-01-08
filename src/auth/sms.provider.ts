import SmsInterface from './sms.interface';
import { Logger } from '@nestjs/common';
const request = require('request');

export class SmsProvider implements SmsInterface {
  private logger = new Logger('SMSService');

  async sendMessage(to, message): Promise<void> {
    request.post(
      {
        url: 'http://ippanel.com/api/select',
        body: {
          op: 'pattern',
          user: 'digimop',
          pass: 'fater@8484',
          fromNum: '+983000505',
          toNum: to,
          patternCode: 'pixlu03n7d',
          inputData: [{ 'verification-code': message }],
        },
        json: true,
      },
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log(response.body);
        } else {
          console.log('whatever you want');
        }
      },
    );
  }
}
