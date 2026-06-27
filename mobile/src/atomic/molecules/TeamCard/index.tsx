import React from 'react';
import styled from 'styled-components/native';
import { colors, spacing, typography } from '../../../theme';
import { Team } from '../../../store/teams/types';
import ColorDot from '../../atoms/ColorDot';

interface Props {
  team: Team;
  onPress: () => void;
}

const Card = styled.TouchableOpacity`
  background-color: ${colors.card};
  border-radius: 14px;
  padding: ${spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.sm}px;
`;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${spacing.md}px;
`;

const Name = styled.Text`
  color: ${colors.text};
  font-size: ${typography.fontSizeMd}px;
  font-weight: ${typography.fontWeightMedium};
`;

const Arrow = styled.Text`
  color: ${colors.textSecondary};
  font-size: 22px;
`;

export default function TeamCard({ team, onPress }: Props) {
  return (
    <Card onPress={onPress} activeOpacity={0.8}>
      <Left>
        <ColorDot color={team.color} size={20} />
        <Name>{team.name}</Name>
      </Left>
      <Arrow>›</Arrow>
    </Card>
  );
}
