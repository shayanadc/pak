import { PipeTransform, BadRequestException } from '@nestjs/common';

export class PhoneValidationPipe implements PipeTransform {
  transform(phone: any) {
    if (phone.length < 11) {
      throw new BadRequestException('phone must be a pattern');
    }
  }
}