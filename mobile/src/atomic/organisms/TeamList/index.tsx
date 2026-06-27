import React, { useCallback } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Team } from '../../../store/teams/types';
import TeamCard from '../../molecules/TeamCard';
import { colors, spacing, typography } from '../../../theme';

interface Props {
  teams: Team[];
  loading: boolean;
  error: string | null;
  onSelectTeam: (team: Team) => void;
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

const RetryBtn = styled.TouchableOpacity`
  margin-top: ${spacing.md}px;
`;

const RetryText = styled.Text`
  color: ${colors.primary};
  font-size: ${typography.fontSizeMd}px;
`;

export default function TeamList({ teams, loading, error, onSelectTeam, onRetry }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Team }) => <TeamCard team={item} onPress={() => onSelectTeam(item)} />,
    [onSelectTeam],
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

  if (teams.length === 0) {
    return (
      <Center>
        <EmptyText>Nenhum time encontrado.{'\n'}Crie o primeiro time!</EmptyText>
      </Center>
    );
  }

  return (
    <FlatList
      data={teams}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: spacing.xl }}
    />
  );
}
