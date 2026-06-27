import React, { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Team } from '../../../store/teams/types';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import ColorDot from '../../atoms/ColorDot';
import { colors, spacing, typography } from '../../../theme';
import { isHexColor, isNotEmpty } from '../../../utils/validators';

interface Props {
  initial?: Partial<Team>;
  loading: boolean;
  error: string | null;
  onSubmit: (data: { name: string; color: string }) => void;
  onDelete?: () => void;
  submitLabel?: string;
}

const Form = styled.ScrollView``;

const Icon = styled.Text`
  font-size: 48px;
  text-align: center;
  margin-bottom: ${spacing.xl}px;
`;

const Preview = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${spacing.md}px;
  margin-bottom: ${spacing.md}px;
  padding: ${spacing.md}px;
  background-color: ${colors.card};
  border-radius: 10px;
`;

const PreviewColor = styled.Text<{ color: string }>`
  font-size: ${typography.fontSizeMd}px;
  color: ${({ color }) => color};
`;

const ApiError = styled.Text`
  color: ${colors.danger};
  font-size: ${typography.fontSizeSm}px;
  margin-bottom: ${spacing.md}px;
  text-align: center;
`;

const DeleteBtn = styled.TouchableOpacity`
  margin-top: ${spacing.sm}px;
  align-items: center;
  padding: ${spacing.md}px;
`;

const DeleteText = styled.Text`
  color: ${colors.danger};
  font-size: ${typography.fontSizeMd}px;
`;

export default function TeamForm({ initial, loading, error, onSubmit, onDelete, submitLabel = 'Salvar' }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? '#');
  const [errors, setErrors] = useState<{ name?: string; color?: string }>({});

  // Sync state when initial data arrives (e.g., after Redux fetch completes)
  useEffect(() => {
    if (initial) {
      setName(initial.name ?? '');
      setColor(initial.color ?? '#');
    }
  }, [initial]);

  const validate = () => {
    const e: { name?: string; color?: string } = {};
    if (!isNotEmpty(name)) e.name = 'Nome é obrigatório';
    if (!isHexColor(color)) e.color = 'Cor deve ser hexadecimal válida (ex: #00FF66)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit({ name: name.trim(), color });
  };

  const handleDelete = () => {
    Alert.alert('Excluir time', 'Tem certeza que deseja excluir este time? As tarefas vinculadas não serão excluídas.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Form showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Icon>👥</Icon>

        <Input
          label="Nome do time"
          placeholder="Ex: Time Verde"
          value={name}
          onChangeText={setName}
          error={errors.name}
          autoCapitalize="words"
        />

        <Input
          label="Cor do time"
          placeholder="#00FF66"
          value={color}
          onChangeText={(t) => setColor(t.toUpperCase())}
          error={errors.color}
          autoCapitalize="characters"
          maxLength={7}
        />

        {isHexColor(color) && (
          <Preview>
            <ColorDot color={color} size={32} />
            <PreviewColor color={color}>Cor: {color}</PreviewColor>
          </Preview>
        )}

        {error ? <ApiError>{error}</ApiError> : null}

        <Button title={submitLabel} onPress={handleSubmit} loading={loading} />

        {onDelete && (
          <DeleteBtn onPress={handleDelete}>
            <DeleteText>Excluir time</DeleteText>
          </DeleteBtn>
        )}
      </Form>
    </KeyboardAvoidingView>
  );
}
