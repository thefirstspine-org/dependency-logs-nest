import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { LogsService } from '@thefirstspine/logs';
import { LogsService as TFSLogsService } from '@thefirstspine/logs';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestsLoggerMiddleware implements NestMiddleware {

  private static logsService: LogsService|undefined = undefined;

  constructor() {
  }
    
  use(request: Request, response: Response, next: NextFunction): void {
    RequestsLoggerMiddleware.use(request, response, next);
  }

  public static use(request: Request, response: Response, next: NextFunction) {
    if (RequestsLoggerMiddleware.logsService == undefined) {
      RequestsLoggerMiddleware.logsService = new TFSLogsService();
    }

    try {
      const { ip, method, path: url, params, query } = request;
      const userAgent = request.get('user-agent') || '';

      RequestsLoggerMiddleware.logsService.http(
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
  
        RequestsLoggerMiddleware.logsService.http(
          `Response to ${method} ${url}`,
          {
              statusCode,
              contentLength,
          }
        );
      });
    } catch (e) {
      RequestsLoggerMiddleware.logsService.warning(
        `Error while logging request`,
        {
            error: e.getMessage(),
        }
      );
    }

    next();
  }
}