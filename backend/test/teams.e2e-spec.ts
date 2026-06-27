import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

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
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
  _client: {},
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

const fakeTeam = {
  id: 'abc-123',
  name: 'Time Verde',
  color: '#009B72',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Teams (e2e)', () => {
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
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  // POST /api/teams
  describe('POST /api/teams', () => {
    it('deve criar um time com dados válidos', async () => {
      mockPrisma.team.create.mockResolvedValue(fakeTeam);

      const res = await request(app.getHttpServer())
        .post('/api/teams')
        .send({ name: 'Time Verde', color: '#009B72' })
        .expect(201);

      expect(res.body.name).toBe('Time Verde');
      expect(res.body.color).toBe('#009B72');
      expect(mockPrisma.team.create).toHaveBeenCalledTimes(1);
    });

    it('deve rejeitar cor inválida (400)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/teams')
        .send({ name: 'Time', color: 'vermelho' })
        .expect(400);

      expect(res.body.message).toBeDefined();
    });

    it('deve rejeitar nome vazio (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/teams')
        .send({ name: '', color: '#009B72' })
        .expect(400);
    });
  });

  // GET /api/teams
  describe('GET /api/teams', () => {
    it('deve listar times paginados', async () => {
      mockPrisma.$transaction.mockResolvedValue([[fakeTeam], 1]);

      const res = await request(app.getHttpServer())
        .get('/api/teams')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(10);
      expect(res.body.totalPages).toBe(1);
    });

    it('deve aceitar parâmetros de paginação', async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0]);

      const res = await request(app.getHttpServer())
        .get('/api/teams?page=2&limit=5&search=verde')
        .expect(200);

      expect(res.body.page).toBe(2);
      expect(res.body.limit).toBe(5);
    });
  });

  // GET /api/teams/:id
  describe('GET /api/teams/:id', () => {
    it('deve retornar o time pelo ID', async () => {
      mockPrisma.team.findUnique.mockResolvedValue(fakeTeam);

      const res = await request(app.getHttpServer())
        .get('/api/teams/abc-123')
        .expect(200);

      expect(res.body.id).toBe('abc-123');
      expect(res.body.name).toBe('Time Verde');
    });

    it('deve retornar 404 para time inexistente', async () => {
      mockPrisma.team.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/teams/id-nao-existe')
        .expect(404);
    });
  });

  // PUT /api/teams/:id
  describe('PUT /api/teams/:id', () => {
    it('deve atualizar um time existente', async () => {
      const updated = { ...fakeTeam, name: 'Time Azul' };
      mockPrisma.team.findUnique.mockResolvedValue(fakeTeam);
      mockPrisma.team.update.mockResolvedValue(updated);

      const res = await request(app.getHttpServer())
        .put('/api/teams/abc-123')
        .send({ name: 'Time Azul' })
        .expect(200);

      expect(res.body.name).toBe('Time Azul');
    });

    it('deve retornar 404 para time inexistente', async () => {
      mockPrisma.team.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/api/teams/id-nao-existe')
        .send({ name: 'Qualquer' })
        .expect(404);
    });

    it('deve rejeitar cor inválida no update (400)', async () => {
      await request(app.getHttpServer())
        .put('/api/teams/abc-123')
        .send({ color: 'azul' })
        .expect(400);
    });
  });

  // DELETE /api/teams/:id
  describe('DELETE /api/teams/:id', () => {
    it('deve remover um time (204)', async () => {
      mockPrisma.team.findUnique.mockResolvedValue(fakeTeam);
      mockPrisma.team.delete.mockResolvedValue(fakeTeam);

      await request(app.getHttpServer())
        .delete('/api/teams/abc-123')
        .expect(204);

      expect(mockPrisma.team.delete).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 404 para time inexistente', async () => {
      mockPrisma.team.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/api/teams/id-nao-existe')
        .expect(404);
    });
  });
});
