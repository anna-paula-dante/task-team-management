import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

const teamId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const taskId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

const fakeTeam = {
  id: teamId,
  name: 'Time Verde',
  color: '#009B72',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const fakeTask = {
  id: taskId,
  title: 'Criar tela de login',
  description: 'Implementar tela de login conforme mockup',
  status: 'PENDING',
  teams: [fakeTeam],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockPrisma = {
  team: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
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
  $transaction: jest.fn(),
  _client: {},
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

describe('Tasks (e2e)', () => {
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

  // POST /api/tasks
  describe('POST /api/tasks', () => {
    it('deve criar tarefa com times válidos', async () => {
      mockPrisma.team.findMany.mockResolvedValue([fakeTeam]);
      mockPrisma.task.create.mockResolvedValue(fakeTask);

      const res = await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          title: 'Criar tela de login',
          description: 'Implementar tela de login conforme mockup',
          status: 'PENDING',
          teamIds: [teamId],
        })
        .expect(201);

      expect(res.body.title).toBe('Criar tela de login');
      expect(res.body.teams).toHaveLength(1);
    });

    it('deve rejeitar sem título (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          description: 'Sem título',
          teamIds: [teamId],
        })
        .expect(400);
    });

    it('deve rejeitar sem teamIds (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          title: 'Tarefa',
          description: 'Desc',
          teamIds: [],
        })
        .expect(400);
    });

    it('deve rejeitar status inválido (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          title: 'Tarefa',
          description: 'Desc',
          status: 'INVALIDO',
          teamIds: [teamId],
        })
        .expect(400);
    });

    it('deve retornar 400 se teamId não existir', async () => {
      mockPrisma.team.findMany.mockResolvedValue([]);

      await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          title: 'Tarefa',
          description: 'Desc',
          teamIds: ['id-inexistente'],
        })
        .expect(400);
    });
  });

  // GET /api/tasks
  describe('GET /api/tasks', () => {
    it('deve listar tarefas paginadas', async () => {
      mockPrisma.$transaction.mockResolvedValue([[fakeTask], 1]);

      const res = await request(app.getHttpServer())
        .get('/api/tasks')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
      expect(res.body.page).toBe(1);
      expect(res.body.totalPages).toBe(1);
    });

    it('deve filtrar por status', async () => {
      mockPrisma.$transaction.mockResolvedValue([[fakeTask], 1]);

      const res = await request(app.getHttpServer())
        .get('/api/tasks?status=PENDING')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
    });

    it('deve filtrar por teamId', async () => {
      mockPrisma.$transaction.mockResolvedValue([[fakeTask], 1]);

      const res = await request(app.getHttpServer())
        .get(`/api/tasks?teamId=${teamId}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
    });

    it('deve rejeitar status inválido (400)', async () => {
      await request(app.getHttpServer())
        .get('/api/tasks?status=INVALIDO')
        .expect(400);
    });
  });

  // GET /api/tasks/:id
  describe('GET /api/tasks/:id', () => {
    it('deve retornar a tarefa pelo ID', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(fakeTask);

      const res = await request(app.getHttpServer())
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(res.body.id).toBe(taskId);
      expect(res.body.title).toBe('Criar tela de login');
      expect(res.body.teams).toHaveLength(1);
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/tasks/id-nao-existe')
        .expect(404);
    });
  });

  // PUT /api/tasks/:id
  describe('PUT /api/tasks/:id', () => {
    it('deve atualizar uma tarefa existente', async () => {
      const updated = {
        ...fakeTask,
        title: 'Título atualizado',
        status: 'DONE',
      };
      mockPrisma.task.findUnique.mockResolvedValue(fakeTask);
      mockPrisma.task.update.mockResolvedValue(updated);

      const res = await request(app.getHttpServer())
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Título atualizado', status: 'DONE' })
        .expect(200);

      expect(res.body.title).toBe('Título atualizado');
      expect(res.body.status).toBe('DONE');
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/api/tasks/id-nao-existe')
        .send({ title: 'Qualquer' })
        .expect(404);
    });

    it('deve validar teamIds ao atualizar', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(fakeTask);
      mockPrisma.team.findMany.mockResolvedValue([]);

      await request(app.getHttpServer())
        .put(`/api/tasks/${taskId}`)
        .send({ teamIds: ['id-inexistente'] })
        .expect(400);
    });
  });

  // DELETE /api/tasks/:id
  describe('DELETE /api/tasks/:id', () => {
    it('deve remover uma tarefa (204)', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(fakeTask);
      mockPrisma.task.delete.mockResolvedValue(fakeTask);

      await request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .expect(204);

      expect(mockPrisma.task.delete).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 404 para tarefa inexistente', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/api/tasks/id-nao-existe')
        .expect(404);
    });
  });
});
