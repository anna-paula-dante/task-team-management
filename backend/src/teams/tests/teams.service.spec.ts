import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TeamsService } from '../teams.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
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
};

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um time com sucesso', async () => {
      const dto = { name: 'Time Verde', color: '#009B72' };
      const created = {
        id: 'uuid-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.team.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockPrismaService.team.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada', async () => {
      const teams = [{ id: 'uuid-1', name: 'Time Verde', color: '#009B72' }];
      mockPrismaService.$transaction.mockResolvedValue([teams, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: teams,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('deve filtrar por search', async () => {
      mockPrismaService.$transaction.mockResolvedValue([[], 0]);

      await service.findAll({ page: 1, limit: 10, search: 'verde' });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar o time se encontrado', async () => {
      const team = { id: 'uuid-1', name: 'Time Verde', color: '#009B72' };
      mockPrismaService.team.findUnique.mockResolvedValue(team);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(team);
    });

    it('deve lançar NotFoundException se não encontrado', async () => {
      mockPrismaService.team.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar o time', async () => {
      const team = { id: 'uuid-1', name: 'Time Verde', color: '#009B72' };
      const updated = { ...team, name: 'Time Azul' };
      mockPrismaService.team.findUnique.mockResolvedValue(team);
      mockPrismaService.team.update.mockResolvedValue(updated);

      const result = await service.update('uuid-1', { name: 'Time Azul' });
      expect(result).toEqual(updated);
    });

    it('deve lançar NotFoundException ao tentar atualizar time inexistente', async () => {
      mockPrismaService.team.findUnique.mockResolvedValue(null);

      await expect(service.update('id-inexistente', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover o time', async () => {
      const team = { id: 'uuid-1', name: 'Time Verde', color: '#009B72' };
      mockPrismaService.team.findUnique.mockResolvedValue(team);
      mockPrismaService.team.delete.mockResolvedValue(team);

      await service.remove('uuid-1');
      expect(mockPrismaService.team.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });
  });
});
