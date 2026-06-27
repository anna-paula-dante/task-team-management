import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Task & Team Management API')
    .setDescription(
      'API REST para gerenciamento de times e tarefas.\n\n' +
        '**Funcionalidades:**\n' +
        '- CRUD completo de Times e Tarefas\n' +
        '- Associação de uma tarefa a um ou mais times\n' +
        '- Paginação em todas as listagens\n' +
        '- Filtros por status, título e time\n' +
        '- Validação de entradas com mensagens descritivas',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Sobrescreve o array de tags para garantir uma única entrada por grupo,
  // com descrição, na ordem correta — evitando duplicatas geradas pelo scanner
  // do @nestjs/swagger ao processar @ApiTags() nos controllers.
  document.tags = [
    { name: 'Teams', description: 'Operações relacionadas aos times' },
    { name: 'Tasks', description: 'Operações relacionadas às tarefas' },
  ];

  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
