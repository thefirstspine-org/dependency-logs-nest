import { Injectable } from '@nestjs/common';
import { LogsService as TFSLogsService } from '@thefirstspine/logs';

/**
 * Nest service to handle logs in a Nest app.
 */
@Injectable()
export class LogsService {

  /**
   * Internal TFS service.
   */
  protected tfsLogsService: TFSLogsService;

  constructor() {
    this.tfsLogsService = new TFSLogsService();
  }

  /**
   * Log an information message. An information is has only a purpose for debugging.
   * @param message The message to log.
   * @param data The data about the log (context for instance).
   */
  info(message: string, data?: any): void {
    this.tfsLogsService.info(message, data);
  }

  /**
   * Log a warning. A warning is an unexpected behavior that occurs in the platform, but handled properly.
   * @param message The message to log.
   * @param data The data about the log (context for instance).
   */
  warning(message: string, data?: any): void {
    this.tfsLogsService.warning(message, data);
  }

  /**
   * Log an error. An error should be treated immediatly because this is an unexpected and not handled behavior.
   * @param message The message to log.
   * @param data The data about the log (context for instance).
   */
  error(message: string, data?: any): void {
    this.tfsLogsService.error(message, data);
  }

}
