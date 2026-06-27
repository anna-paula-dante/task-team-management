import { all } from 'redux-saga/effects';
import teamsSaga from '../store/teams/sagas';
import tasksSaga from '../store/tasks/sagas';

export default function* rootSaga() {
  yield all([teamsSaga(), tasksSaga()]);
}
