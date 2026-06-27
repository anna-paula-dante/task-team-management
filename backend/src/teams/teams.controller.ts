import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { QueryTaskDto } from '../tasks/dto/query-task.dto';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar time' })
  @ApiResponse({ status: 201, description: 'Time criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar times com paginação e filtro por nome' })
  @ApiResponse({ status: 200, description: 'Lista paginada de times' })
  findAll(@Query() query: QueryTeamDto) {
    return this.teamsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar time por ID' })
  @ApiParam({ name: 'id', description: 'UUID do time', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Time encontrado' })
  @ApiNotFoundResponse({ description: 'Time não encontrado' })
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar time' })
  @ApiParam({ name: 'id', description: 'UUID do time', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Time atualizado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiNotFoundResponse({ description: 'Time não encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover time' })
  @ApiParam({ name: 'id', description: 'UUID do time', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Time removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Time não encontrado' })
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }

  @Get(':teamId/tasks')
  @ApiOperation({
    summary: 'Listar tarefas de um time',
    description:
      'Retorna lista paginada de tarefas associadas ao time. Suporta filtro por status e busca por título/descrição.',
  })
  @ApiParam({ name: 'teamId', description: 'UUID do time', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de tarefas do time',
  })
  @ApiNotFoundResponse({ description: 'Time não encontrado' })
  findTasksByTeam(
    @Param('teamId') teamId: string,
    @Query() query: QueryTaskDto,
  ) {
    return this.tasksService.findByTeam(teamId, query);
  }
}
