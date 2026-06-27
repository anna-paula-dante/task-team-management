import React from 'react';
import styled from 'styled-components/native';
import { colors, spacing, typography } from '../../../theme';
import { Task } from '../../../store/tasks/types';
import StatusBadge from '../../atoms/StatusBadge';
import ColorDot from '../../atoms/ColorDot';

interface Props {
  task: Task;
  onPress: () => void;
}

const Card = styled.TouchableOpacity`
  background-color: ${colors.card};
  border-radius: 14px;
  margin-bottom: ${spacing.sm}px;
  flex-direction: row;
  overflow: hidden;
`;

const TeamBar = styled.View<{ color: string }>`
  width: 4px;
  background-color: ${({ color }) => color};
`;

const Content = styled.View`
  flex: 1;
  padding: ${spacing.md}px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.xs}px;
`;

const Info = styled.View`
  flex: 1;
  margin-right: ${spacing.sm}px;
`;

const Title = styled.Text`
  color: ${colors.text};
  font-size: ${typography.fontSizeMd}px;
  font-weight: ${typography.fontWeightMedium};
`;

const TeamsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.xs}px;
  margin-top: 2px;
`;

const TeamName = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeSm}px;
`;

const Description = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeSm}px;
`;

export default function TaskCard({ task, onPress }: Props) {
  const primaryTeam = task.teams?.[0];

  return (
    <Card onPress={onPress} activeOpacity={0.8}>
      {primaryTeam && <TeamBar color={primaryTeam.color} />}
      <Content>
        <Header>
          <Info>
            <Title numberOfLines={1}>{task.title}</Title>
            {task.teams && task.teams.length > 0 && (
              <TeamsRow>
                {task.teams.map((team) => (
                  <React.Fragment key={team.id}>
                    <ColorDot color={team.color} size={8} />
                    <TeamName>{team.name}</TeamName>
                  </React.Fragment>
                ))}
              </TeamsRow>
            )}
          </Info>
          <StatusBadge status={task.status} />
        </Header>
        <Description numberOfLines={2}>{task.description}</Description>
      </Content>
    </Card>
  );
}
