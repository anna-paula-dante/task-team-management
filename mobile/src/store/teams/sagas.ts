import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import * as T from './types';
import * as A from './actions';

function* fetchTeamsSaga(action: ReturnType<typeof A.fetchTeams>): Generator {
  try {
    const response = (yield call(api.get, '/teams', { params: action.payload })) as { data: T.Pagination };
    yield put(A.fetchTeamsSuccess(response.data));
  } catch (err) {
    yield put(A.fetchTeamsFailure(err instanceof Error ? err.message : 'Erro ao buscar times'));
  }
}

function* createTeamSaga(action: ReturnType<typeof A.createTeam>): Generator {
  try {
    const response = (yield call(api.post, '/teams', action.payload)) as { data: T.Team };
    yield put(A.createTeamSuccess(response.data));
    if (action.onSuccess) action.onSuccess();
  } catch (err) {
    yield put(A.createTeamFailure(err instanceof Error ? err.message : 'Erro ao criar time'));
  }
}

function* updateTeamSaga(action: ReturnType<typeof A.updateTeam>): Generator {
  try {
    const { id, data: body } = action.payload;
    const response = (yield call(api.put, `/teams/${id}`, body)) as { data: T.Team };
    yield put(A.updateTeamSuccess(response.data));
    if (action.onSuccess) action.onSuccess();
  } catch (err) {
    yield put(A.updateTeamFailure(err instanceof Error ? err.message : 'Erro ao atualizar time'));
  }
}

function* deleteTeamSaga(action: ReturnType<typeof A.deleteTeam>): Generator {
  try {
    yield call(api.delete, `/teams/${action.payload}`);
    yield put(A.deleteTeamSuccess(action.payload));
    if (action.onSuccess) action.onSuccess();
  } catch (err) {
    yield put(A.deleteTeamFailure(err instanceof Error ? err.message : 'Erro ao excluir time'));
  }
}

export default function* teamsSaga() {
  yield takeLatest(T.FETCH_TEAMS, fetchTeamsSaga);
  yield takeLatest(T.CREATE_TEAM, createTeamSaga);
  yield takeLatest(T.UPDATE_TEAM, updateTeamSaga);
  yield takeLatest(T.DELETE_TEAM, deleteTeamSaga);
}
