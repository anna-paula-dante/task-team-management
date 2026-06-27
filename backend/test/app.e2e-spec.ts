// App bootstrap e2e smoke test — validação estrutural mínima
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const mockPrisma = {
  team: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn().mockResolvedValue([[], 0]),
  _client: {},
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

describe('App (e2e smoke)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/teams responde 200', async () => {
    mockPrisma.$transaction.mockResolvedValue([[], 0]);
    await request(app.getHttpServer()).get('/api/teams').expect(200);
  });

  it('GET /api/tasks responde 200', async () => {
    mockPrisma.$transaction.mockResolvedValue([[], 0]);
    await request(app.getHttpServer()).get('/api/tasks').expect(200);
  });
});
