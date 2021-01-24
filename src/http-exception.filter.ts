import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import * as env from 'dotenv';
env.config();
const lang = process.env.lang || 'en';
const trs = require(`./${lang}.message.json`);

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // if (exception['response'] != undefined) {
    //   if (
    //     'statusCode' in exception['response'] &&
    //     exception['response'].statusCode == 401
    //   ) {
    //     response.status(401).json({
    //       statusCode: 401,
    //       message: ['UnAuthorized'],
    //       trace: exception,
    //     });
    //   }
    // }
    if (exception instanceof NotFoundException) {
      response.status(400).json({
        statusCode: 400,
        message: exception['response'].message,
        trace: exception,
      });
    }
    if (exception instanceof QueryFailedError) {
      response.status(400).json({
        statusCode: 400,
        message: [trs.exception.db.failed],
        trace: exception,
      });
    }
    if (exception instanceof EntityNotFoundError) {
      response.status(400).json({
        statusCode: 400,
        message: [trs.exception.entity.notFound],
        trace: exception,
      });
    }
    if (exception.hasOwnProperty('response')) {
      if (exception instanceof BadRequestException) {
        response.status(400).json({
          statusCode: 400,
          message: exception['response'].message,
          trace: exception,
        });
      }
      if (exception['response'].statusCode == 401) {
        response.status(401).json({
          statusCode: 401,
          message: exception['response'].message,
          trace: exception,
        });
      }
      if (exception['response'].statusCode == 403) {
        response.status(403).json({
          statusCode: 403,
          message: exception['response'].message,
          trace: exception,
        });
      }
    }
  }
}
