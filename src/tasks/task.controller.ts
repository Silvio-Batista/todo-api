import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('tasks') // Organiza no Swagger
@ApiBearerAuth() // Adiciona autenticação JWT no Swagger
@Controller('tasks')
@UseGuards(AuthGuard('jwt')) // Protege todas as rotas com JWT
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas com paginação e filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Quantidade de itens por página',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'compras',
    description: 'Texto para busca',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'pendente',
    description: 'Filtrar pelo status',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    example: '2025-03-01',
    description: 'Data inicial para filtro',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    example: '2025-03-15',
    description: 'Data final para filtro',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'createdAt',
    description: 'Campo para ordenação',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'ASC',
    description: 'Ordem de classificação',
  })
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ tasks: Task[]; total: number }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.taskService.getAllTasks(
      pageNumber,
      limitNumber,
      search,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro na criação da tarefa' })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa pelo ID' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiParam({
    name: 'id',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'ID da tarefa',
  })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma tarefa pelo ID' })
  @ApiResponse({ status: 204, description: 'Tarefa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiParam({
    name: 'id',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'ID da tarefa',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
