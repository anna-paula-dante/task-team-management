import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateTeamIds(teamIds: string[]) {
    if (!teamIds || teamIds.length === 0) {
      throw new BadRequestException('Pelo menos um time deve ser informado');
    }

    const teams = await this.prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true },
    });

    if (teams.length !== teamIds.length) {
      const foundIds = teams.map((t) => t.id);
      const missing = teamIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `Times não encontrados: ${missing.join(', ')}`,
      );
    }
  }

  async create(dto: CreateTaskDto) {
    const { teamIds, ...taskData } = dto;
    await this.validateTeamIds(teamIds);

    return this.prisma.task.create({
      data: {
        ...taskData,
        teams: { connect: teamIds.map((id) => ({ id })) },
      },
      include: { teams: true },
    });
  }

  async findAll(query: QueryTaskDto) {
    const { page = 1, limit = 10, search, status, teamId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {};

    if (status) where.status = status;
    if (teamId) where.teams = { some: { id: teamId } };
    if (search)
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { teams: true },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { teams: true },
    });
    if (!task)
      throw new NotFoundException(`Tarefa com id ${id} não encontrada`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);

    const { teamIds, ...taskData } = dto;

    if (teamIds !== undefined) {
      await this.validateTeamIds(teamIds);
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        ...(teamIds !== undefined && {
          teams: { set: teamIds.map((tid) => ({ id: tid })) },
        }),
      },
      include: { teams: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }

  async findByTeam(teamId: string, query: QueryTaskDto) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team)
      throw new NotFoundException(`Time com id ${teamId} não encontrado`);

    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = { teams: { some: { id: teamId } } };
    if (status) where.status = status;
    if (search)
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { teams: true },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
