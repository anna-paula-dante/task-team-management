# Mobile — Task Team Management

App React Native com Expo para gestão de tarefas e times.

## Setup

```bash
npm install
cp .env.example .env
# editar EXPO_PUBLIC_API_URL com o IP da sua máquina
npx expo start
```

> Use o IP da máquina (não `localhost`) ao rodar no emulador Android.
> Padrão para emulador Android: `http://10.0.2.2:3000/api`

## Estrutura

```
src/
  app/          # Store, rootReducer, rootSaga
  navigation/   # AppNavigator + tipos de rotas
  services/     # api.ts (Axios)
  store/
    teams/      # actions, reducer, sagas, types
    tasks/      # actions, reducer, sagas, types
  atomic/
    atoms/      # Button, Input, StatusBadge, ColorDot, IconButton
    molecules/  # TeamCard, TaskCard, SearchInput, SelectInput
    organisms/  # (expandível)
    templates/  # ScreenContainer
  screens/
    Teams/      # TeamsListScreen, CreateTeamScreen
    Tasks/      # TasksListScreen, CreateTaskScreen, EditTaskScreen
  theme/        # colors, spacing, typography
  utils/        # validators
```
