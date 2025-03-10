import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './tasks/task.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TaskModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
