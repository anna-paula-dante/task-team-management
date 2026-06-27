import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTasksByTeam } from '../../store/tasks/actions';
import { Task } from '../../store/tasks/types';
import ScreenContainer from '../../atomic/templates/ScreenContainer';
import TaskList from '../../atomic/organisms/TaskList';
import Button from '../../atomic/atoms/Button';
import IconButton from '../../atomic/atoms/IconButton';
import { spacing } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'TasksList'>;

const Footer = styled.View`
  padding-vertical: ${spacing.md}px;
`;

export default function TasksListScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId, teamName } = route.params;
  const { data: tasks, loading, error } = useAppSelector((s) => s.tasks);

  const loadTasks = useCallback(() => {
    dispatch(fetchTasksByTeam(teamId));
  }, [dispatch, teamId]);

  useEffect(() => {
    loadTasks();
    const unsub = navigation.addListener('focus', loadTasks);
    return unsub;
  }, [loadTasks, navigation]);

  const handleSelectTask = (task: Task) => {
    navigation.navigate('EditTask', { taskId: task.id, teamId });
  };

  return (
    <ScreenContainer
      title="Tarefas"
      subtitle={`Tarefas de ${teamName}`}
      headerLeft={<IconButton icon="←" onPress={() => navigation.goBack()} />}
    >
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onSelectTask={handleSelectTask}
        onRetry={loadTasks}
      />

      <Footer>
        <Button
          title="Nova Tarefa"
          onPress={() => navigation.navigate('CreateTask', { teamId })}
        />
      </Footer>
    </ScreenContainer>
  );
}
