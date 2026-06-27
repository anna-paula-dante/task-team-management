import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../../../theme';

interface Props {
  icon: string;
  onPress: () => void;
  color?: string;
}

const Btn = styled.TouchableOpacity`
  padding: 4px;
`;

const Icon = styled.Text<{ color: string }>`
  font-size: 22px;
  color: ${({ color }) => color};
`;

export default function IconButton({ icon, onPress, color = colors.text }: Props) {
  return (
    <Btn
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon color={color}>{icon}</Icon>
    </Btn>
  );
}
