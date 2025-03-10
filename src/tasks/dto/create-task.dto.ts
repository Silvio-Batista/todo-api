import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { TaskStatus } from '../task.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fazer compras', description: 'Título da tarefa' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Comprar pão e leite', description: 'Descrição da tarefa', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-03-15T10:00:00.000Z', description: 'Data prazo da atividade' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  activityDate: Date;

  @ApiProperty({
    example: 'pendente',
    description: 'Status da tarefa',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
