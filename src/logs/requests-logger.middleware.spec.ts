import {describe, expect, beforeEach, it} from '@jest/globals';
import { RequestsLoggerMiddleware } from './requests-logger.middleware';

describe('RequestsLoggerMiddleware', () => {
  let middleware: RequestsLoggerMiddleware;

  beforeEach(async () => {
    middleware = new RequestsLoggerMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
