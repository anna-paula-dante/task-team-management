import React, { useCallback } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Task } from '../../../store/tasks/types';
import TaskCard from '../../molecules/TaskCard';
import { colors, spacing, typography } from '../../../theme';

interface Props {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onSelectTask: (task: Task) => void;
  onRetry: () => void;
}

const Center = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xl}px;
`;

const ErrorText = styled.Text`
  color: ${colors.danger};
  font-size: ${typography.fontSizeMd}px;
  text-align: center;
`;

const EmptyText = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeMd}px;
  text-align: center;
`;

const EmptySub = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeSm}px;
  margin-top: 4px;
  text-align: center;
`;

const RetryBtn = styled.TouchableOpacity`
  margin-top: ${spacing.md}px;
`;

const RetryText = styled.Text`
  color: ${colors.primary};
  font-size: ${typography.fontSizeMd}px;
`;

export default function TaskList({ tasks, loading, error, onSelectTask, onRetry }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Task }) => <TaskCard task={item} onPress={() => onSelectTask(item)} />,
    [onSelectTask],
  );

  if (loading) {
    return (
      <Center>
        <ActivityIndicator color={colors.primary} size="large" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <ErrorText>{error}</ErrorText>
        <RetryBtn onPress={onRetry}>
          <RetryText>Tentar novamente</RetryText>
        </RetryBtn>
      </Center>
    );
  }

  if (tasks.length === 0) {
    return (
      <Center>
        <EmptyText>Nenhuma tarefa encontrada.</EmptyText>
        <EmptySub>Crie a primeira tarefa para este time!</EmptySub>
      </Center>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: spacing.xl }}
    />
  );
}
