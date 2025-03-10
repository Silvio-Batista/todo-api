import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../task.entity';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    example: 'Nova tarefa',
    description: 'Novo título da tarefa',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: 'Atualizando a descrição',
    description: 'Nova descrição da tarefa',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '2025-03-20T10:00:00.000Z',
    description: 'Nova data prazo da atividade',
    required: false,
  })
  activityDate?: Date;

  @ApiProperty({
    example: 'concluído',
    description: 'Novo status da tarefa',
    enum: TaskStatus,
    required: false,
  })
  status?: TaskStatus;
}
