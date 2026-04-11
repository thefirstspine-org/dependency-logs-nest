import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { LogsService } from '@thefirstspine/logs';
import { LogsService as TFSLogsService } from '@thefirstspine/logs';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestsLoggerMiddleware implements NestMiddleware {

  private static logsService: LogsService | undefined = undefined;

  constructor() {
  }
    
  use(request: Request, response: Response, next: NextFunction): void {
    RequestsLoggerMiddleware.use(request, response, next);
  }

  public static use(request: Request, response: Response, next: NextFunction) {
    if (!RequestsLoggerMiddleware.logsService) {
      RequestsLoggerMiddleware.logsService = new TFSLogsService();
    }

    try {
      const { ip, method, path: url, params, query } = request;
      const userAgent = request.get('user-agent') || '';

      RequestsLoggerMiddleware?.logsService?.http(
          `Request ${method} ${url}`,
          {
            userAgent,
            ip,
            params,
            query,
            body: response.req.body,
          }
        );
  
      response.on('finish', () => {
        const { statusCode } = response;
        const contentLength = response.get('content-length');
  
        RequestsLoggerMiddleware?.logsService?.http(
          `Response to ${method} ${url}`,
          {
              statusCode,
              contentLength,
          }
        );
      });
    } catch (error: any) {
      // If it's an HttpException, get the message
      if (error instanceof HttpException) {
        const response = error.getResponse();
        // response can be a string or an object
        const message =
          typeof response === 'string' ? response : (response as any).message;
        RequestsLoggerMiddleware.logsService.warning(
          `Error while logging request`,
          {
              error: message,
          }
        );
      }

      // Fallback for unknown errors
      RequestsLoggerMiddleware.logsService.warning(
        `Error while logging request`,
        {
            error: error?.message || 'Unknown error',
        }
      );
    }

    next();
  }
}