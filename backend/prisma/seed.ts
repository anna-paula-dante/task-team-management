import { PrismaClient, TaskStatus } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.task.deleteMany();
  await prisma.team.deleteMany();

  const team1 = await prisma.team.create({
    data: { name: 'Time Verde', color: '#009B72' },
  });

  const team2 = await prisma.team.create({
    data: { name: 'Time Azul', color: '#0066FF' },
  });

  const team3 = await prisma.team.create({
    data: { name: 'Time Vermelho', color: '#D32F2F' },
  });

  await prisma.task.create({
    data: {
      title: 'Criar tela de times',
      description: 'Implementar listagem de times seguindo o mockup aprovado',
      status: TaskStatus.DONE,
      teams: { connect: [{ id: team1.id }] },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Integrar API de tarefas',
      description: 'Conectar o frontend com os endpoints REST do backend',
      status: TaskStatus.IN_PROGRESS,
      teams: { connect: [{ id: team1.id }, { id: team2.id }] },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Escrever testes unitários',
      description: 'Adicionar testes para os services de teams e tasks',
      status: TaskStatus.PENDING,
      teams: { connect: [{ id: team2.id }] },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Configurar CI/CD',
      description: 'Criar pipeline de integração contínua no GitHub Actions',
      status: TaskStatus.PENDING,
      teams: { connect: [{ id: team3.id }] },
    },
  });

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
