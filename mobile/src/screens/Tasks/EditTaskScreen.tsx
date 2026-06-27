import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTaskById, updateTask, deleteTask } from '../../store/tasks/actions';
import { fetchTeams } from '../../store/teams/actions';
import { TaskStatus } from '../../store/tasks/types';
import ScreenContainer from '../../atomic/templates/ScreenContainer';
import TaskForm from '../../atomic/organisms/TaskForm';
import IconButton from '../../atomic/atoms/IconButton';
import { colors } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'EditTask'>;

export default function EditTaskScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { taskId } = route.params;

  const { selectedTask, loading, error } = useAppSelector((s) => s.tasks);
  const { data: teams } = useAppSelector((s) => s.teams);

  useEffect(() => {
    dispatch(fetchTaskById(taskId));
    dispatch(fetchTeams({ limit: 100 }));
  }, [dispatch, taskId]);

  const handleSubmit = (data: { title: string; description: string; teamIds: string[]; status: TaskStatus }) => {
    dispatch(updateTask(taskId, data, () => navigation.goBack()));
  };

  const handleDelete = () => {
    Alert.alert('Excluir tarefa', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => dispatch(deleteTask(taskId, () => navigation.goBack())),
      },
    ]);
  };

  // Show loading until the correct task is available
  const taskReady = selectedTask && selectedTask.id === taskId;

  const initial = taskReady
    ? {
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        teamIds: selectedTask.teams?.map((t) => t.id) ?? [],
      }
    : undefined;

  return (
    <ScreenContainer
      title="Editar Tarefa"
      subtitle="atualize as informações da tarefa"
      headerLeft={<IconButton icon="←" onPress={() => navigation.goBack()} />}
      headerRight={<IconButton icon="🗑" onPress={handleDelete} color={colors.danger} />}
    >
      <TaskForm
        initial={initial}
        teams={teams}
        loading={loading || !taskReady}
        error={error}
        onSubmit={handleSubmit}
        submitLabel="Salvar"
      />
    </ScreenContainer>
  );
}
