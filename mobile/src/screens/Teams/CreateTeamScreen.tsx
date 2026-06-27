import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createTeam } from '../../store/teams/actions';
import ScreenContainer from '../../atomic/templates/ScreenContainer';
import TeamForm from '../../atomic/organisms/TeamForm';
import IconButton from '../../atomic/atoms/IconButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CreateTeamScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const { loading, error } = useAppSelector((s) => s.teams);

  const handleSubmit = (data: { name: string; color: string }) => {
    dispatch(createTeam(data, () => navigation.goBack()));
  };

  return (
    <ScreenContainer
      title="Novo Time"
      subtitle="crie seu time para gerenciar as tarefas"
      headerLeft={<IconButton icon="←" onPress={() => navigation.goBack()} />}
    >
      <TeamForm
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        submitLabel="Criar"
      />
    </ScreenContainer>
  );
}
