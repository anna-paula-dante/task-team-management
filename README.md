````md
# Sistema de Gestão de Tarefas e Times

Aplicação **full stack** para gerenciamento de tarefas dentro de times.

O sistema permite criar, listar, editar e excluir times e tarefas. Cada tarefa pode ser
associada a um ou mais timese possui controle de status.

---

## Linguagens, Frameworks e Tecnologias

| Camada | Linguagem | Tecnologias utilizadas |
|---|---|---|
| Backend | TypeScript / Node.js | NestJS, Prisma ORM, PostgreSQL, Swagger,
class-validator, Jest e Supertest |
| Aplicativo mobile | TypeScript | React Native, Expo, React Navigation, Redux,
Redux-Saga, Axios e Styled Components |
| Banco de dados | SQL | PostgreSQL |
| Testes | Jest e Supertest |

**Aplicativo mobile:** validado funcionalmente no Android Emulator nos fluxos de criação,
edição, exclusão e listagem de times e tarefas.

> O backend é uma API REST construída em **Node.js + TypeScript + NestJS**.  
> O aplicativo é desenvolvido em **React Native + TypeScript + Expo**.

---

## Funcionalidades Implementadas

- CRUD completo de times.
- CRUD completo de tarefas.
- Associação de uma tarefa a um ou mais times.
- Status de tarefa: Pendente, Em Progresso e Concluída.
- Busca de times e tarefas.
- Paginação nas listagens.
- Filtro de tarefas por status e por time.
- Criação, edição e exclusão de times.
- Criação, edição e exclusão de tarefas.
- Validação de formulários no aplicativo e na API.
- Documentação interativa da API com Swagger.
- Dados iniciais para facilitar a avaliação.
- Testes unitários e testes e2e no backend.

---

## Atendimento aos Requisitos Técnicos

| Requisito | Implementação |
|---|---|
| React Native | Aplicativo desenvolvido com React Native |
| Expo | Utilizado para execução e desenvolvimento mobile |
| TypeScript | Utilizado no backend e no aplicativo mobile |
| Backend REST | API REST desenvolvida com NestJS |
| Banco de dados | PostgreSQL |
| ORM | Prisma ORM |
| CRUD de Times | Implementado |
| CRUD de Tarefas | Implementado |
| Tarefa vinculada a vários times | Relacionamento muitos-para-muitos |
| Redux | Gerenciamento de estado global |
| Redux-Saga | Requisições assíncronas e efeitos colaterais |
| Styled Components | Estilização com tema centralizado |
| Atomic Design | Organização de componentes do mobile |
| Swagger | Documentação interativa da API |
| Testes | Testes unitários e e2e com Jest e Supertest |
| GraphQL | Não implementado; tratado como melhoria futura opcional |

---

## Arquitetura

### Backend

O backend foi organizado em camadas:

```text
Controller
   ↓
Service / Use Case
   ↓
PrismaService
   ↓
PostgreSQL
````

* **Controllers:** recebem as requisições HTTP e validam os dados recebidos por meio de DTOs.
* **Services:** concentram as regras de negócio.
* **PrismaService:** realiza a comunicação com o banco de dados PostgreSQL.
* **DTOs:** utilizam `class-validator` e `class-transformer`.
* **Exception Filter:** padroniza o tratamento de erros da API.

### Aplicativo Mobile

O aplicativo segue o conceito de **Atomic Design**:

```text
atoms → molecules → organisms → templates → screens
```

| Camada    | Exemplos                                                        |
| --------- | --------------------------------------------------------------- |
| Atoms     | Button, Input, StatusBadge, ColorDot e IconButton               |
| Molecules | TeamCard, TaskCard, SearchInput, SelectInput e MultiSelectInput |
| Organisms | TeamList, TaskList, TeamForm e TaskForm                         |
| Templates | ScreenContainer                                                 |
| Screens   | Listagem, criação e edição de times e tarefas                   |

O estado global é gerenciado com Redux. Todas as chamadas assíncronas para a API são tratadas por Redux-Saga.

---

## Estrutura do Projeto

```text
task-team-management/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── common/
│   │   ├── prisma/
│   │   ├── tasks/
│   │   ├── teams/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── .env.example
│   └── package.json
│
├── mobile/
│   ├── src/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── store/
│   │   ├── theme/
│   │   └── components/
│   ├── .env.example
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Banco de Dados

O banco de dados utilizado é o **PostgreSQL**, acessado com o Prisma ORM.

### Entidades

| Entidade | Campos principais                                                |
| -------- | ---------------------------------------------------------------- |
| Team     | `id`, `name`, `color`, `createdAt`, `updatedAt`                  |
| Task     | `id`, `title`, `description`, `status`, `createdAt`, `updatedAt` |

### Relacionamento

```text
Team  * ───────── *  Task
```

Uma tarefa pode estar vinculada a um ou mais times. Um time pode possuir várias tarefas.

O Prisma gerencia a tabela intermediária de relacionamento muitos-para-muitos automaticamente.

### Status de Tarefa

| Valor salvo   | Exibição no aplicativo |
| ------------- | ---------------------- |
| `PENDING`     | Pendente               |
| `IN_PROGRESS` | Em Progresso           |
| `DONE`        | Concluída              |

---

## Pré-requisitos

Antes de executar o projeto, instale:

* Node.js 18 ou superior.
* npm.
* PostgreSQL localmente ou Docker.
* Android Studio e Android Emulator para testar o aplicativo Android.

---

## Configuração do Banco de Dados

### Credenciais locais de desenvolvimento

| Campo   | Valor             |
| ------- | ----------------- |
| Host    | `localhost`       |
| Porta   | `5432`            |
| Banco   | `task_management` |
| Usuário | `postgres`        |
| Senha   | `postgres`        |

> Essas credenciais são destinadas apenas ao ambiente local de desenvolvimento.

### Criar PostgreSQL com Docker

```bash
docker run --name postgres-tasks \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=task_management \
  -p 5432:5432 \
  -d postgres:15
```

Para iniciar o container em outro momento:

```bash
docker start postgres-tasks
```
---

## Como Executar o Backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Caso ocorra conflito de dependências:

```bash
npm install --legacy-peer-deps
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Configure o arquivo `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management"
PORT=3000
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute as migrations existentes:

```bash
npx prisma migrate deploy
```

Insira os dados iniciais:

```bash
npx prisma db seed
```

Inicie o servidor:

```bash
npm run start:dev
```

A API estará disponível em:

```text
http://localhost:3000/api
```

---

## Swagger

Após iniciar o backend, acesse a documentação interativa:

```text
http://localhost:3000/api/docs
```

O Swagger permite visualizar e testar os endpoints dos módulos:

* Teams
* Tasks

---

## Como Executar o Aplicativo Mobile

Acesse a pasta do aplicativo:

```bash
cd mobile
```

Instale as dependências:

```bash
npm install
```

Caso ocorra conflito de dependências:

```bash
npm install --legacy-peer-deps
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

### Android Emulator

No arquivo `mobile/.env`, configure:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

> `10.0.2.2` é o endereço usado pelo Android Emulator para acessar o backend executado no computador.

Inicie o Expo:

```bash
npx expo start -c
```

Com o Android Emulator aberto, pressione:

```text
a
```

no terminal do Expo para abrir o aplicativo.

### Dispositivo Físico

Para executar em um celular conectado à mesma rede Wi-Fi, substitua o endereço pelo IP local do computador:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000/api
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api
```

---

## Acesso ao Aplicativo

O aplicativo não possui autenticação, pois login e controle de acesso não fazem parte do escopo do teste técnico.

Portanto, não é necessário usuário ou senha para utilizar as funcionalidades do aplicativo.

---

## Fluxo Principal do Aplicativo

1. Abrir o aplicativo.
2. Visualizar a lista de times.
3. Pesquisar um time pelo nome.
4. Criar um novo time com nome e cor hexadecimal.
5. Selecionar um time.
6. Visualizar, editar ou excluir o time.
7. Acessar as tarefas vinculadas ao time.
8. Criar uma nova tarefa.
9. Informar título, descrição, status e um ou mais times.
10. Editar ou excluir uma tarefa.

---

## Endpoints da API

### Times

| Método   | Rota                       | Descrição                          |
| -------- | -------------------------- | ---------------------------------- |
| `POST`   | `/api/teams`               | Cria um novo time                  |
| `GET`    | `/api/teams`               | Lista times com paginação e busca  |
| `GET`    | `/api/teams/:id`           | Busca um time pelo ID              |
| `PUT`    | `/api/teams/:id`           | Atualiza um time                   |
| `DELETE` | `/api/teams/:id`           | Remove um time                     |
| `GET`    | `/api/teams/:teamId/tasks` | Lista tarefas vinculadas a um time |

### Tarefas

| Método   | Rota             | Descrição                             |
| -------- | ---------------- | ------------------------------------- |
| `POST`   | `/api/tasks`     | Cria uma nova tarefa                  |
| `GET`    | `/api/tasks`     | Lista tarefas com paginação e filtros |
| `GET`    | `/api/tasks/:id` | Busca uma tarefa pelo ID              |
| `PUT`    | `/api/tasks/:id` | Atualiza uma tarefa                   |
| `DELETE` | `/api/tasks/:id` | Remove uma tarefa                     |

---

## Exemplos de Requisição

### Criar Time

```http
POST /api/teams
```

```json
{
  "name": "Time Produto",
  "color": "#0066FF"
}
```

### Criar Tarefa

```http
POST /api/tasks
```

```json
{
  "title": "Implementar autenticação",
  "description": "Criar fluxo de login e proteção de rotas.",
  "status": "PENDING",
  "teamIds": [
    "UUID_DO_TIME"
  ]
}
```

---

## Parâmetros de Consulta

| Parâmetro | Tipo       | Descrição                                    |
| --------- | ---------- | -------------------------------------------- |
| `page`    | number     | Página atual. Padrão: `1`                    |
| `limit`   | number     | Quantidade de itens por página. Padrão: `10` |
| `search`  | string     | Busca por nome do time ou título da tarefa   |
| `status`  | TaskStatus | Filtra tarefas por status                    |
| `teamId`  | UUID       | Filtra tarefas por time                      |

### Exemplo de resposta paginada

```json
{
  "data": [],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

## Validações e Tratamento de Erros

* Nome do time é obrigatório.
* A cor do time deve seguir o formato hexadecimal `#RRGGBB`.
* Título e descrição da tarefa são obrigatórios.
* O status deve ser `PENDING`, `IN_PROGRESS` ou `DONE`.
* Todos os times informados em `teamIds` devem existir no banco.
* Dados inválidos retornam HTTP `400`.
* Times ou tarefas não encontrados retornam HTTP `404`.
* Os erros da API seguem tratamento global por Exception Filter.

---

## Dados Iniciais

O seed do banco cria registros para facilitar a avaliação:

### Times

* Time Verde
* Time Azul
* Time Vermelho

### Tarefas

* Criar tela de times
* Integrar API de tarefas
* Escrever testes unitários
* Configurar CI/CD

As tarefas já possuem associações com os times criados.

---

## Consultar o Banco pelo DBeaver

Use os seguintes dados de conexão:

| Campo    | Valor             |
| -------- | ----------------- |
| Driver   | PostgreSQL        |
| Host     | `localhost`       |
| Porta    | `5432`            |
| Database | `task_management` |
| Usuário  | `postgres`        |
| Senha    | `postgres`        |

As tabelas principais são:

```text
Team
Task
_TaskTeams
_prisma_migrations
```

> A tabela `_prisma_migrations` é gerenciada pelo Prisma e não deve ser alterada manualmente.

---

## Testes

Execute os testes do backend:

```bash
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

O projeto possui:

* 17 testes unitários.
* 30 testes e2e.
* 47 testes automatizados no total.

Os testes cobrem regras de negócio, validações e endpoints HTTP dos módulos de Times e Tarefas.

---

## Decisões Técnicas

* **TypeScript ponta a ponta:** segurança de tipos no backend e no aplicativo mobile.
* **NestJS:** estrutura modular, injeção de dependência, DTOs e documentação com Swagger.
* **PostgreSQL:** banco relacional adequado para entidades e relacionamentos.
* **Prisma ORM:** migrations, seed, tipagem forte e facilidade de manutenção.
* **Relacionamento muitos-para-muitos:** uma tarefa pode pertencer a vários times.
* **Redux-Saga:** centralização de efeitos assíncronos e requisições HTTP.
* **Styled Components:** componentes reutilizáveis e tema visual centralizado.
* **Atomic Design:** organização de componentes por responsabilidade e nível de complexidade.
* **REST API:** prioridade do desafio técnico e da implementação.
* **GraphQL:** mantido como possibilidade de evolução futura.
* **Sem autenticação:** funcionalidade fora do escopo definido para o teste técnico.

---

## Melhorias Futuras

* Autenticação com JWT e refresh token.
* Permissões de usuário por time.
* WebSocket para atualização em tempo real.
* Notificações push.
* Filtros e ordenações avançadas.
* Upload de anexos para tarefas.
* Pipeline de CI/CD com GitHub Actions.
* Docker Compose para subir API e banco de dados juntos.
* Testes de interface com React Native Testing Library.
* Camada GraphQL adicional à API REST.

---

## Licença

Projeto desenvolvido exclusivamente para fins de avaliação técnica.
