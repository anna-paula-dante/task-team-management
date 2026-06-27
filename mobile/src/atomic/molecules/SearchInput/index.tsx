import React from 'react';
import styled from 'styled-components/native';
import { colors, spacing, typography } from '../../../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const Container = styled.View`
  background-color: ${colors.input};
  border-radius: 12px;
  padding-horizontal: ${spacing.md}px;
  border-width: 1px;
  border-color: ${colors.border};
  margin-bottom: ${spacing.md}px;
`;

const StyledInput = styled.TextInput`
  height: 46px;
  color: ${colors.text};
  font-size: ${typography.fontSizeMd}px;
`;

export default function SearchInput({ value, onChangeText, placeholder = 'Buscar...' }: Props) {
  return (
    <Container>
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.primary}
      />
    </Container>
  );
}
