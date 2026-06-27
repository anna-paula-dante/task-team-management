import React, { useState } from 'react';
import { Modal, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { colors, spacing, typography } from '../../../theme';

export interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

const Wrapper = styled.View`
  margin-bottom: ${spacing.md}px;
`;

const FieldLabel = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeSm}px;
  margin-bottom: ${spacing.xs}px;
`;

const Trigger = styled.TouchableOpacity<{ hasError: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.input};
  border-radius: 10px;
  padding-horizontal: ${spacing.md}px;
  padding-vertical: 14px;
  border-width: 1px;
  border-color: ${({ hasError }) => (hasError ? colors.danger : colors.border)};
  min-height: 52px;
`;

const TriggerText = styled.Text<{ empty: boolean }>`
  color: ${({ empty }) => (empty ? colors.textSecondary : colors.text)};
  font-size: ${typography.fontSizeMd}px;
  flex: 1;
`;

const Arrow = styled.Text`
  color: ${colors.textSecondary};
  font-size: 16px;
`;

const ErrorMsg = styled.Text`
  color: ${colors.danger};
  font-size: ${typography.fontSizeXs}px;
  margin-top: 4px;
`;

const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  padding: ${spacing.lg}px;
`;

const Menu = styled.View`
  background-color: ${colors.card};
  border-radius: 12px;
  overflow: hidden;
`;

const MenuHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md}px ${spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

const MenuTitle = styled.Text`
  color: ${colors.text};
  font-size: ${typography.fontSizeMd}px;
  font-weight: ${typography.fontWeightBold};
`;

const DoneBtn = styled.TouchableOpacity``;

const DoneText = styled.Text`
  color: ${colors.primary};
  font-size: ${typography.fontSizeMd}px;
  font-weight: ${typography.fontWeightBold};
`;

const Option = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.md}px;
  padding-horizontal: ${spacing.lg}px;
  gap: ${spacing.sm}px;
`;

const Checkbox = styled.View<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border-width: 2px;
  border-color: ${({ checked }) => (checked ? colors.primary : colors.border)};
  background-color: ${({ checked }) => (checked ? colors.primary : 'transparent')};
  justify-content: center;
  align-items: center;
`;

const Check = styled.Text`
  color: ${colors.text};
  font-size: 12px;
  font-weight: ${typography.fontWeightBold};
`;

const OptionText = styled.Text`
  color: ${colors.text};
  font-size: ${typography.fontSizeMd}px;
`;

export default function MultiSelectInput({
  label,
  placeholder = 'Selecione um ou mais...',
  options,
  values,
  onChange,
  error,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggle = (val: string) => {
    onChange(values.includes(val) ? values.filter((v) => v !== val) : [...values, val]);
  };

  const selectedLabels = options
    .filter((o) => values.includes(o.value))
    .map((o) => o.label)
    .join(', ');

  return (
    <Wrapper>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <Trigger hasError={!!error} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <TriggerText empty={values.length === 0}>{values.length === 0 ? placeholder : selectedLabels}</TriggerText>
        <Arrow>▾</Arrow>
      </Trigger>
      {error ? <ErrorMsg>{error}</ErrorMsg> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Overlay activeOpacity={1} onPress={() => setOpen(false)}>
          <Menu>
            <MenuHeader>
              <MenuTitle>Selecionar Times</MenuTitle>
              <DoneBtn onPress={() => setOpen(false)}>
                <DoneText>Confirmar</DoneText>
              </DoneBtn>
            </MenuHeader>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const checked = values.includes(item.value);
                return (
                  <Option onPress={() => toggle(item.value)}>
                    <Checkbox checked={checked}>{checked ? <Check>✓</Check> : null}</Checkbox>
                    <OptionText>{item.label}</OptionText>
                  </Option>
                );
              }}
            />
          </Menu>
        </Overlay>
      </Modal>
    </Wrapper>
  );
}
