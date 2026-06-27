export type RootStackParamList = {
  TeamsList: undefined;
  CreateTeam: undefined;
  EditTeam: { teamId: string };
  TasksList: { teamId: string; teamName: string };
  CreateTask: { teamId: string };
  EditTask: { taskId: string; teamId: string };
};
