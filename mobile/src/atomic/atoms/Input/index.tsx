import React from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { colors, spacing, typography } from '../../../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
}

const Wrapper = styled.View`
  margin-bottom: ${spacing.md}px;
`;

const Label = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeSm}px;
  margin-bottom: ${spacing.xs}px;
`;

const StyledInput = styled.TextInput<{ hasError: boolean; multiline?: boolean }>`
  background-color: ${colors.input};
  color: ${colors.text};
  border-radius: 10px;
  padding-horizontal: ${spacing.md}px;
  padding-vertical: 14px;
  font-size: ${typography.fontSizeMd}px;
  border-width: 1px;
  border-color: ${({ hasError }) => (hasError ? colors.danger : colors.border)};
  min-height: ${({ multiline }) => (multiline ? 100 : 0)}px;
`;

const ErrorText = styled.Text`
  color: ${colors.danger};
  font-size: ${typography.fontSizeXs}px;
  margin-top: 4px;
`;

export default function Input({ label, error, multiline, style, ...rest }: Props) {
  return (
    <Wrapper>
      {label ? <Label>{label}</Label> : null}
      <StyledInput
        hasError={!!error}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.primary}
        style={style}
        {...rest}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Wrapper>
  );
}
