import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TeamsModule } from './teams/teams.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, TeamsModule, TasksModule],
})
export class AppModule {}
