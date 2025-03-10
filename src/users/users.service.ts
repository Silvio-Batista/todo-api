import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Nome de usuário já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }
}
