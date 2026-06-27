import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  team: {
    findMany: jest.fn(),
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
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar tarefa com teams válidos', async () => {
      const teamId = 'uuid-team-1';
      const dto = {
        title: 'Nova tarefa',
        description: 'Descrição',
        teamIds: [teamId],
      };
      const created = {
        id: 'uuid-task-1',
        title: dto.title,
        description: dto.description,
        status: 'PENDING',
        teams: [{ id: teamId }],
      };

      mockPrismaService.team.findMany.mockResolvedValue([{ id: teamId }]);
      mockPrismaService.task.create.mockResolvedValue(created);

      const result = await service.create(dto as any);
      expect(result).toEqual(created);
    });

    it('deve lançar BadRequestException se teamId não existir', async () => {
      mockPrismaService.team.findMany.mockResolvedValue([]);

      await expect(
        service.create({
          title: 'Tarefa',
          description: 'Desc',
          teamIds: ['id-inexistente'],
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se teamIds vazio', async () => {
      await expect(
        service.create({
          title: 'Tarefa',
          description: 'Desc',
          teamIds: [],
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada', async () => {
      const tasks = [{ id: 'uuid-1', title: 'Tarefa', teams: [] }];
      mockPrismaService.$transaction.mockResolvedValue([tasks, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toEqual({
        data: tasks,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar a tarefa se encontrada', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa', teams: [] };
      mockPrismaService.task.findUnique.mockResolvedValue(task);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(task);
    });

    it('deve lançar NotFoundException se tarefa não existir', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar a tarefa', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa', teams: [] };
      const updated = { ...task, title: 'Tarefa Atualizada' };
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.update.mockResolvedValue(updated);

      const result = await service.update('uuid-1', {
        title: 'Tarefa Atualizada',
      });
      expect(result).toEqual(updated);
    });

    it('deve validar teamIds ao atualizar', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa', teams: [] };
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.team.findMany.mockResolvedValue([]);

      await expect(
        service.update('uuid-1', { teamIds: ['id-inexistente'] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('deve remover a tarefa', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa', teams: [] };
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.delete.mockResolvedValue(task);

      await service.remove('uuid-1');
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });
  });
});
