import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import * as T from './types';
import * as A from './actions';

function* fetchTasksSaga(action: ReturnType<typeof A.fetchTasks>): Generator {
  try {
    const response = (yield call(api.get, '/tasks', { params: action.payload })) as { data: T.TaskPagination };
    yield put(A.fetchTasksSuccess(response.data));
  } catch (err) {
    yield put(A.fetchTasksFailure(err instanceof Error ? err.message : 'Erro ao buscar tarefas'));
  }
}

function* fetchTasksByTeamSaga(action: ReturnType<typeof A.fetchTasksByTeam>): Generator {
  try {
    const { teamId, params } = action.payload;
    const response = (yield call(api.get, `/teams/${teamId}/tasks`, { params })) as { data: T.TaskPagination };
    yield put(A.fetchTasksByTeamSuccess(response.data));
  } catch (err) {
    yield put(A.fetchTasksByTeamFailure(err instanceof Error ? err.message : 'Erro ao buscar tarefas do time'));
  }
}

function* fetchTaskByIdSaga(action: ReturnType<typeof A.fetchTaskById>): Generator {
  try {
    const response = (yield call(api.get, `/tasks/${action.payload}`)) as { data: T.Task };
    yield put(A.fetchTaskByIdSuccess(response.data));
  } catch (err) {
    yield put(A.fetchTaskByIdFailure(err instanceof Error ? err.message : 'Erro ao buscar tarefa'));
  }
}

function* createTaskSaga(action: ReturnType<typeof A.createTask>): Generator {
  try {
    const response = (yield call(api.post, '/tasks', action.payload)) as { data: T.Task };
    yield put(A.createTaskSuccess(response.data));
    if (action.onSuccess) action.onSuccess();
  } catch (err) {
    yield put(A.createTaskFailure(err instanceof Error ? err.message : 'Erro ao criar tarefa'));
  }
}

function* updateTaskSaga(action: ReturnType<typeof A.updateTask>): Generator {
  try {
    const { id, data: body } = action.payload;
    const response = (yield call(api.put, `/tasks/${id}`, body)) as { data: T.Task };
    yield put(A.updateTaskSuccess(response.data));
    if (action.onSuccess) action.onSuccess();
  } catch (err) {
    yield put(A.updateTaskFailure(err instanceof Error ? err.message : 'Erro ao atualizar tarefa'));
  }
}

function* deleteTaskSaga(action: ReturnType<typeof A.deleteTask>): Generator {
  try {
    yield call(api.delete, `/tasks/${action.payload}`);
    yield put(A.deleteTaskSuccess(action.payload));
    if (action.onSuccess) action.onSuccess();
  } catch (err) {
    yield put(A.deleteTaskFailure(err instanceof Error ? err.message : 'Erro ao excluir tarefa'));
  }
}

export default function* tasksSaga() {
  yield takeLatest(T.FETCH_TASKS, fetchTasksSaga);
  yield takeLatest(T.FETCH_TASKS_BY_TEAM, fetchTasksByTeamSaga);
  yield takeLatest(T.FETCH_TASK_BY_ID, fetchTaskByIdSaga);
  yield takeLatest(T.CREATE_TASK, createTaskSaga);
  yield takeLatest(T.UPDATE_TASK, updateTaskSaga);
  yield takeLatest(T.DELETE_TASK, deleteTaskSaga);
}
