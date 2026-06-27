import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colors, spacing, typography } from '../../../theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}

const Touchable = styled.TouchableOpacity<{ bg: string; muted: boolean }>`
  height: 52px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  padding-horizontal: ${spacing.lg}px;
  background-color: ${({ bg }) => bg};
  opacity: ${({ muted }) => (muted ? 0.6 : 1)};
`;

const Label = styled.Text`
  color: ${colors.text};
  font-size: ${typography.fontSizeMd}px;
  font-weight: ${typography.fontWeightBold};
`;

export default function Button({ title, onPress, loading, disabled, variant = 'primary' }: Props) {
  const bg = variant === 'danger' ? colors.danger : colors.primary;
  const muted = !!(disabled || loading);

  return (
    <Touchable bg={bg} muted={muted} onPress={onPress} disabled={muted} activeOpacity={0.8}>
      {loading ? <ActivityIndicator color={colors.text} /> : <Label>{title}</Label>}
    </Touchable>
  );
}
