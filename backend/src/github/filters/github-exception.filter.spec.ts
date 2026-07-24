import { GithubExceptionFilter } from './github-exception.filter';
import {
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

describe('GithubExceptionFilter', () => {
  let filter: GithubExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
    } as Partial<Response>;

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as Partial<ArgumentsHost>;

    filter = new GithubExceptionFilter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch HttpException', () => {
    it('should return consistent error envelope for NotFoundException (404)', () => {
      const exception = new NotFoundException("User 'unknown' not found");

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        statusCode: 404,
        message: "User 'unknown' not found",
        error: 'Not Found',
      });
    });

    it('should return consistent error envelope for BadRequestException (400)', () => {
      const exception = new BadRequestException('Invalid username format');

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Invalid username format',
        error: 'Bad Request',
      });
    });

    it('should return consistent error envelope for rate limit HttpException (429)', () => {
      const exception = new HttpException(
        'GitHub rate limit exceeded',
        429,
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(statusMock).toHaveBeenCalledWith(429);
      expect(jsonMock).toHaveBeenCalledWith({
        statusCode: 429,
        message: 'GitHub rate limit exceeded',
        error: '',
      });
    });

    it('should return the status code and message from the exception', () => {
      const exception = new HttpException(
        { message: 'Custom error', statusCode: 418 },
        418,
      );

      filter.catch(exception, mockArgumentsHost as ArgumentsHost);

      expect(statusMock).toHaveBeenCalledWith(418);
      expect(jsonMock).toHaveBeenCalledWith({
        statusCode: 418,
        message: 'Custom error',
        error: '',
      });
    });
  });
});
