import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<{ tasks: Task[]; total: number }> {
    const query = this.taskRepository.createQueryBuilder('task');

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (startDate && endDate) {
      query.andWhere('task.activityDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (sortBy === 'createdAt' && sortOrder) {
      query.orderBy('task.createdAt', sortOrder);
    }

    if (sortBy === 'updatedAt' && sortOrder) {
      query.orderBy('task.updatedAt', sortOrder);
    }

    query.skip((page - 1) * limit).take(limit);

    const [tasks, total] = await query.getManyAndCount();

    return { tasks, total };
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task) throw new NotFoundException('Tarefa não encontrada.');

    await this.taskRepository.update(id, updateTaskDto);
    return this.getTaskById(id);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada.');
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  }
}
