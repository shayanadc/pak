import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception['response'] != undefined) {
      if (
        'statusCode' in exception['response'] &&
        exception['response'].statusCode == 401
      ) {
        response.status(401).json({
          statusCode: 401,
          message: ['UnAuthorized'],
          trace: exception,
        });
      }
    }
    if (exception instanceof QueryFailedError) {
      response.status(400).json({
        statusCode: 400,
        message: ['Database Error'],
        trace: exception,
      });
    } else {
      response.status(400).json({
        statusCode: 400,
        message: exception['response'].message,
        trace: exception,
      });
    }
  }
}
