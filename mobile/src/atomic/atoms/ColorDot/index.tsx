import React from 'react';
import styled from 'styled-components/native';

interface Props {
  color: string;
  size?: number;
}

const Dot = styled.View<{ color: string; size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ color }) => color};
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.2);
`;

export default function ColorDot({ color, size = 16 }: Props) {
  return <Dot color={color} size={size} />;
}
