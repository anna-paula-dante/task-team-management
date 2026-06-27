import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Modal, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/routes';
import { fetchTeams, deleteTeam } from '../../store/teams/actions';
import { Team } from '../../store/teams/types';
import ScreenContainer from '../../atomic/templates/ScreenContainer';
import SearchInput from '../../atomic/molecules/SearchInput';
import TeamList from '../../atomic/organisms/TeamList';
import Button from '../../atomic/atoms/Button';
import { colors, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Bottom-sheet de ações do time
const Sheet = styled.View`
  background-color: ${colors.card};
  border-radius: 16px;
  padding: ${spacing.lg}px;
  margin: ${spacing.lg}px;
`;

const SheetTitle = styled.Text`
  color: ${colors.text};
  font-size: ${typography.fontSizeLg}px;
  font-weight: ${typography.fontWeightBold};
  margin-bottom: 4px;
`;

const SheetSub = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeSm}px;
  margin-bottom: ${spacing.lg}px;
`;

const SheetBtn = styled.TouchableOpacity<{ danger?: boolean }>`
  padding: ${spacing.md}px;
  border-radius: 10px;
  background-color: ${({ danger }) => (danger ? colors.danger + '22' : colors.primary + '22')};
  align-items: center;
  margin-bottom: ${spacing.sm}px;
`;

const SheetBtnText = styled.Text<{ danger?: boolean }>`
  color: ${({ danger }) => (danger ? colors.danger : colors.primary)};
  font-size: ${typography.fontSizeMd}px;
  font-weight: ${typography.fontWeightMedium};
`;

const SheetCancel = styled.TouchableOpacity`
  align-items: center;
  padding: ${spacing.md}px;
`;

const SheetCancelText = styled.Text`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeMd}px;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-end;
`;

const Footer = styled.View`
  padding-vertical: ${spacing.md}px;
`;

export default function TeamsListScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const { data: teams, loading, error } = useAppSelector((s) => s.teams);

  const [search, setSearch] = useState('');
  const [actionTeam, setActionTeam] = useState<Team | null>(null);
  const searchRef = useRef(search);
  searchRef.current = search;

  const loadTeams = useCallback(
    (q?: string) => dispatch(fetchTeams({ search: q })),
    [dispatch],
  );

  useEffect(() => {
    loadTeams();
    const unsub = navigation.addListener('focus', () => loadTeams(searchRef.current));
    return unsub;
  }, [loadTeams, navigation]);

  useEffect(() => {
    const timeout = setTimeout(() => loadTeams(search), 400);
    return () => clearTimeout(timeout);
  }, [search, loadTeams]);

  const openActions = (team: Team) => setActionTeam(team);
  const closeActions = () => setActionTeam(null);

  const goToTasks = (team: Team) => {
    closeActions();
    navigation.navigate('TasksList', { teamId: team.id, teamName: team.name });
  };

  const goToEdit = () => {
    if (!actionTeam) return;
    closeActions();
    navigation.navigate('EditTeam', { teamId: actionTeam.id });
  };

  const handleDelete = () => {
    if (!actionTeam) return;
    Alert.alert(
      'Excluir time',
      `Excluir "${actionTeam.name}"? As tarefas vinculadas não serão excluídas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTeam(actionTeam.id, () => { closeActions(); loadTeams(); }));
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer title="Times" subtitle="Acesse um dos times">
      <SearchInput value={search} onChangeText={setSearch} placeholder="Busque um time" />

      <TeamList
        teams={teams}
        loading={loading}
        error={error}
        onSelectTeam={openActions}
        onRetry={() => loadTeams(search)}
      />

      <Footer>
        <Button title="Criar time" onPress={() => navigation.navigate('CreateTeam')} />
      </Footer>

      {/* Bottom-sheet de ações */}
      <Modal
        visible={!!actionTeam}
        transparent
        animationType="slide"
        onRequestClose={closeActions}
      >
        <Overlay>
          <Sheet>
            <SheetTitle>{actionTeam?.name}</SheetTitle>
            <SheetSub>{actionTeam?.color}</SheetSub>

            <SheetBtn onPress={() => goToTasks(actionTeam!)}>
              <SheetBtnText>Ver tarefas</SheetBtnText>
            </SheetBtn>

            <SheetBtn onPress={goToEdit}>
              <SheetBtnText>Editar time</SheetBtnText>
            </SheetBtn>

            <SheetBtn danger onPress={handleDelete}>
              <SheetBtnText danger>Excluir time</SheetBtnText>
            </SheetBtn>

            <SheetCancel onPress={closeActions}>
              <SheetCancelText>Cancelar</SheetCancelText>
            </SheetCancel>
          </Sheet>
        </Overlay>
      </Modal>
    </ScreenContainer>
  );
}
