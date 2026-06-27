import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateTeam, deleteTeam } from '../../store/teams/actions';
import ScreenContainer from '../../atomic/templates/ScreenContainer';
import TeamForm from '../../atomic/organisms/TeamForm';
import IconButton from '../../atomic/atoms/IconButton';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'EditTeam'>;

export default function EditTeamScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId } = route.params;

  const { data: teams, loading, error } = useAppSelector((s) => s.teams);
  const team = teams.find((t) => t.id === teamId);

  const handleSubmit = (data: { name: string; color: string }) => {
    dispatch(updateTeam(teamId, data, () => navigation.goBack()));
  };

  const handleDelete = () => {
    dispatch(deleteTeam(teamId, () => navigation.navigate('TeamsList')));
  };

  if (!team) {
    return (
      <ScreenContainer
        title="Time não encontrado"
        headerLeft={<IconButton icon="←" onPress={() => navigation.goBack()} />}
      >
        {null}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      title="Editar Time"
      subtitle="atualize as informações do time"
      headerLeft={<IconButton icon="←" onPress={() => navigation.goBack()} />}
    >
      <TeamForm
        initial={team}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        submitLabel="Salvar"
      />
    </ScreenContainer>
  );
}
