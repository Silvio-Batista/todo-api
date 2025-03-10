import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('Deve estar definido', () => {
    expect(taskService).toBeDefined();
  });

  it('Deve criar uma nova tarefa', async () => {
    const taskData = {
      title: 'Nova tarefa',
      description: 'Descrição da nova tarefa',
      activityDate: new Date(),
      status: TaskStatus.PENDING,
    };

    jest.spyOn(taskRepository, 'create').mockReturnValue(taskData as Task);
    jest.spyOn(taskRepository, 'save').mockResolvedValue(taskData as Task);

    const result = await taskService.createTask(taskData);

    expect(result).toEqual(taskData);
    expect(taskRepository.create).toHaveBeenCalledWith(taskData);
    expect(taskRepository.save).toHaveBeenCalledWith(taskData);
  });

  it('Deve buscar todas as tarefas com paginação', async () => {
    const tasks = [
      {
        title: 'Tarefa 1',
        description: 'Teste',
        status: TaskStatus.PENDING,
      } as Task,
      {
        title: 'Tarefa 1',
        description: 'Teste',
        status: TaskStatus.IN_PROGRESS,
      } as Task,
    ];

    jest.spyOn(taskRepository, 'createQueryBuilder').mockImplementation(
      () =>
        ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          take: jest.fn().mockReturnThis(),
          getManyAndCount: jest.fn().mockResolvedValue([tasks, tasks.length]),
        }) as any,
    );

    const result = await taskService.getAllTasks(1, 10);

    expect(result.tasks.length).toBe(2);
    expect(result.total).toBe(2);
    expect(taskRepository.createQueryBuilder).toHaveBeenCalled();
  });
  
  it('Deve atualizar uma tarefa', async () => {
    const existingTask = {
      title: 'Tarefa Antiga',
      status: 'pendente',
    } as Task;
    const updatedData = { status: TaskStatus.COMPLETED };

    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask);
    jest
      .spyOn(taskRepository, 'update')
      .mockResolvedValue({ affected: 1 } as any);

    const result = await taskService.updateTask('1', updatedData);

    expect(result).toEqual(existingTask);
    expect(taskRepository.update).toHaveBeenCalledWith('1', updatedData);
  });

  it('Deve excluir uma tarefa', async () => {
    jest
      .spyOn(taskRepository, 'delete')
      .mockResolvedValue({ affected: 1 } as any);

    await expect(taskService.deleteTask('1')).resolves.not.toThrow();
    expect(taskRepository.delete).toHaveBeenCalledWith('1');
  });
});
