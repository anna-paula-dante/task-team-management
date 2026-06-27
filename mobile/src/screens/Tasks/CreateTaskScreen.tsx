import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createTask } from '../../store/tasks/actions';
import { fetchTeams } from '../../store/teams/actions';
import { TaskStatus } from '../../store/tasks/types';
import ScreenContainer from '../../atomic/templates/ScreenContainer';
import TaskForm from '../../atomic/organisms/TaskForm';
import IconButton from '../../atomic/atoms/IconButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'CreateTask'>;

export default function CreateTaskScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId } = route.params;

  const { loading, error } = useAppSelector((s) => s.tasks);
  const { data: teams } = useAppSelector((s) => s.teams);

  useEffect(() => {
    dispatch(fetchTeams({ limit: 100 }));
  }, [dispatch]);

  const handleSubmit = (data: { title: string; description: string; teamIds: string[]; status: TaskStatus }) => {
    dispatch(createTask(data, () => navigation.goBack()));
  };

  return (
    <ScreenContainer
      title="Nova Tarefa"
      subtitle="crie sua tarefa para o time"
      headerLeft={<IconButton icon="←" onPress={() => navigation.goBack()} />}
    >
      <TaskForm
        initial={{ teamIds: [teamId], status: 'PENDING' }}
        teams={teams}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        submitLabel="Criar"
      />
    </ScreenContainer>
  );
}
