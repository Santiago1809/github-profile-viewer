import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GithubExceptionFilter } from './../src/github/filters/github-exception.filter';

describe('GithubController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new GithubExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return 200 with { status: "ok" }', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({ status: 'ok' });
    });
  });

  describe('GET /user/:username', () => {
    it('should return 400 for invalid username format (special chars)', () => {
      return request(app.getHttpServer())
        .get('/user/user!name')
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('Invalid username format');
        });
    });

    it('should return 400 for username with leading hyphen', () => {
      return request(app.getHttpServer())
        .get('/user/-leading')
        .expect(400);
    });

    it('should return 400 for username with consecutive hyphens', () => {
      return request(app.getHttpServer())
        .get('/user/user--name')
        .expect(400);
    });

    it('should use consistent error envelope for validation errors', () => {
      return request(app.getHttpServer())
        .get('/user/user!name')
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error');
        });
    });
  });
});
