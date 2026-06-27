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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar tarefa',
    description:
      'Cria uma nova tarefa associada a um ou mais times. Todos os teamIds informados devem existir.',
  })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou times não encontrados',
  })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar tarefas com paginação e filtros',
    description: 'Suporta filtro por status, teamId e busca por título/descrição.',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de tarefas' })
  findAll(@Query() query: QueryTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar tarefa',
    description: 'Todos os campos são opcionais. Ao fornecer teamIds, a lista de times é substituída completamente.',
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou times não encontrados',
  })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover tarefa' })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Tarefa removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
