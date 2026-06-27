import React from 'react';
import styled from 'styled-components/native';
import { typography, spacing } from '../../../theme';
import { TaskStatus } from '../../../store/tasks/types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em Progresso',
  DONE: 'Concluída',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: '#D32F2F',
  IN_PROGRESS: '#FBC02D',
  DONE: '#689F38',
};

const Badge = styled.View<{ bg: string }>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.sm}px;
  padding-vertical: 4px;
  border-radius: 20px;
  background-color: ${({ bg }) => bg};
  gap: 4px;
`;

const Dot = styled.View<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ color }) => color};
`;

const BadgeLabel = styled.Text<{ color: string }>`
  font-size: ${typography.fontSizeXs}px;
  font-weight: ${typography.fontWeightMedium};
  color: ${({ color }) => color};
`;

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <Badge bg={color + '33'}>
      <Dot color={color} />
      <BadgeLabel color={color}>{STATUS_LABELS[status]}</BadgeLabel>
    </Badge>
  );
}
