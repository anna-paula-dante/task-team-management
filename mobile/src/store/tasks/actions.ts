import * as T from './types';

export const fetchTasks = (params?: { page?: number; limit?: number; search?: string; status?: T.TaskStatus; teamId?: string }) => ({
  type: T.FETCH_TASKS as typeof T.FETCH_TASKS,
  payload: params,
});

export const fetchTasksSuccess = (data: T.TaskPagination) => ({
  type: T.FETCH_TASKS_SUCCESS as typeof T.FETCH_TASKS_SUCCESS,
  payload: data,
});

export const fetchTasksFailure = (error: string) => ({
  type: T.FETCH_TASKS_FAILURE as typeof T.FETCH_TASKS_FAILURE,
  payload: error,
});

export const fetchTasksByTeam = (teamId: string, params?: { page?: number; limit?: number; status?: T.TaskStatus; search?: string }) => ({
  type: T.FETCH_TASKS_BY_TEAM as typeof T.FETCH_TASKS_BY_TEAM,
  payload: { teamId, params },
});

export const fetchTasksByTeamSuccess = (data: T.TaskPagination) => ({
  type: T.FETCH_TASKS_BY_TEAM_SUCCESS as typeof T.FETCH_TASKS_BY_TEAM_SUCCESS,
  payload: data,
});

export const fetchTasksByTeamFailure = (error: string) => ({
  type: T.FETCH_TASKS_BY_TEAM_FAILURE as typeof T.FETCH_TASKS_BY_TEAM_FAILURE,
  payload: error,
});

export const fetchTaskById = (id: string) => ({
  type: T.FETCH_TASK_BY_ID as typeof T.FETCH_TASK_BY_ID,
  payload: id,
});

export const fetchTaskByIdSuccess = (task: T.Task) => ({
  type: T.FETCH_TASK_BY_ID_SUCCESS as typeof T.FETCH_TASK_BY_ID_SUCCESS,
  payload: task,
});

export const fetchTaskByIdFailure = (error: string) => ({
  type: T.FETCH_TASK_BY_ID_FAILURE as typeof T.FETCH_TASK_BY_ID_FAILURE,
  payload: error,
});

export const createTask = (
  data: { title: string; description: string; status: T.TaskStatus; teamIds: string[] },
  onSuccess?: () => void,
) => ({
  type: T.CREATE_TASK as typeof T.CREATE_TASK,
  payload: data,
  onSuccess,
});

export const createTaskSuccess = (task: T.Task) => ({
  type: T.CREATE_TASK_SUCCESS as typeof T.CREATE_TASK_SUCCESS,
  payload: task,
});

export const createTaskFailure = (error: string) => ({
  type: T.CREATE_TASK_FAILURE as typeof T.CREATE_TASK_FAILURE,
  payload: error,
});

export const updateTask = (
  id: string,
  data: Partial<{ title: string; description: string; status: T.TaskStatus; teamIds: string[] }>,
  onSuccess?: () => void,
) => ({
  type: T.UPDATE_TASK as typeof T.UPDATE_TASK,
  payload: { id, data },
  onSuccess,
});

export const updateTaskSuccess = (task: T.Task) => ({
  type: T.UPDATE_TASK_SUCCESS as typeof T.UPDATE_TASK_SUCCESS,
  payload: task,
});

export const updateTaskFailure = (error: string) => ({
  type: T.UPDATE_TASK_FAILURE as typeof T.UPDATE_TASK_FAILURE,
  payload: error,
});

export const deleteTask = (id: string, onSuccess?: () => void) => ({
  type: T.DELETE_TASK as typeof T.DELETE_TASK,
  payload: id,
  onSuccess,
});

export const deleteTaskSuccess = (id: string) => ({
  type: T.DELETE_TASK_SUCCESS as typeof T.DELETE_TASK_SUCCESS,
  payload: id,
});

export const deleteTaskFailure = (error: string) => ({
  type: T.DELETE_TASK_FAILURE as typeof T.DELETE_TASK_FAILURE,
  payload: error,
});

export const setSelectedTask = (task: T.Task | null) => ({
  type: T.SET_SELECTED_TASK as typeof T.SET_SELECTED_TASK,
  payload: task,
});
