import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Team } from '../../../store/teams/types';
import { TaskStatus } from '../../../store/tasks/types';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import SelectInput, { SelectOption } from '../../molecules/SelectInput';
import MultiSelectInput from '../../molecules/MultiSelectInput';
import { colors, spacing, typography } from '../../../theme';
import { isNotEmpty } from '../../../utils/validators';

interface TaskFormData {
  title: string;
  description: string;
  teamIds: string[];
  status: TaskStatus;
}

interface Props {
  initial?: Partial<TaskFormData>;
  teams: Team[];
  loading: boolean;
  error: string | null;
  onSubmit: (data: TaskFormData) => void;
  submitLabel?: string;
}

const STATUS_OPTIONS: SelectOption[] = [
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Em Progresso', value: 'IN_PROGRESS' },
  { label: 'Concluída', value: 'DONE' },
];

const Form = styled.ScrollView``;

const Icon = styled.Text`
  font-size: 48px;
  text-align: center;
  margin-bottom: ${spacing.xl}px;
  color: ${colors.primary};
`;

const ApiError = styled.Text`
  color: ${colors.danger};
  font-size: ${typography.fontSizeSm}px;
  margin-bottom: ${spacing.md}px;
  text-align: center;
`;

export default function TaskForm({ initial, teams, loading, error, onSubmit, submitLabel = 'Salvar' }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [teamIds, setTeamIds] = useState<string[]>(initial?.teamIds ?? []);
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'PENDING');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form state when initial data arrives (e.g., after fetchTaskById completes)
  useEffect(() => {
    if (initial) {
      setTitle(initial.title ?? '');
      setDescription(initial.description ?? '');
      setTeamIds(initial.teamIds ?? []);
      setStatus(initial.status ?? 'PENDING');
    }
  }, [initial]);

  const teamOptions: SelectOption[] = teams.map((t) => ({ label: t.name, value: t.id }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isNotEmpty(title)) e.title = 'Título é obrigatório';
    if (!isNotEmpty(description)) e.description = 'Descrição é obrigatória';
    if (teamIds.length === 0) e.teamIds = 'Selecione ao menos um time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ title: title.trim(), description: description.trim(), teamIds, status });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Form showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Icon>✓</Icon>

        <Input
          label="Título"
          placeholder="Ex: Criar tela de login"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <Input
          label="Descrição"
          placeholder="Descreva a tarefa..."
          value={description}
          onChangeText={setDescription}
          error={errors.description}
          multiline
        />

        <MultiSelectInput
          label="Times"
          placeholder="Selecione um ou mais times"
          options={teamOptions}
          values={teamIds}
          onChange={setTeamIds}
          error={errors.teamIds}
        />

        <SelectInput
          label="Status"
          placeholder="Selecione um status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(v) => setStatus(v as TaskStatus)}
        />

        {error ? <ApiError>{error}</ApiError> : null}

        <Button title={submitLabel} onPress={handleSubmit} loading={loading} />
      </Form>
    </KeyboardAvoidingView>
  );
}
