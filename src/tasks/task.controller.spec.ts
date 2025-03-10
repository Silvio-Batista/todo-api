import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskStatus } from './task.entity';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            getAllTasks: jest.fn().mockResolvedValue({ tasks: [], total: 0 }),
            createTask: jest.fn().mockResolvedValue({
              title: 'Nova Tarefa',
              description: 'Descrição da tarefa',
              activityDate: new Date(),
              status: TaskStatus.PENDING,
            }),
            updateTask: jest.fn().mockResolvedValue({}),
            deleteTask: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('Deve estar definido', () => {
    expect(taskController).toBeDefined();
  });

  it('Deve listar tarefas', async () => {
    expect(
      await taskController.findAll(
        '1',
        '10',
        '',
        '',
        '',
        '',
        'createdAt',
        'ASC',
      ),
    ).toEqual({ tasks: [], total: 0 });
    expect(taskService.getAllTasks).toHaveBeenCalled();
  });

  it('Deve criar uma tarefa', async () => {
    const newTask = {
      title: 'Nova Tarefa',
      description: 'Descrição da tarefa',
      activityDate: new Date(),
      status: TaskStatus.PENDING,
    };

    expect(await taskController.create(newTask)).toEqual(
      expect.objectContaining({
        title: 'Nova Tarefa',
        description: expect.any(String),
        activityDate: expect.any(Date),
        status: TaskStatus.PENDING,
      }),
    );

    expect(taskService.createTask).toHaveBeenCalled();
  });
});
