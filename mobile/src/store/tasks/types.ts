import { Team } from '../teams/types';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  teams: Team[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskPagination {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface TasksState {
  data: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  pagination: { total: number; page: number; limit: number };
}

export const FETCH_TASKS = 'tasks/FETCH_TASKS';
export const FETCH_TASKS_SUCCESS = 'tasks/FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'tasks/FETCH_TASKS_FAILURE';

export const FETCH_TASKS_BY_TEAM = 'tasks/FETCH_TASKS_BY_TEAM';
export const FETCH_TASKS_BY_TEAM_SUCCESS = 'tasks/FETCH_TASKS_BY_TEAM_SUCCESS';
export const FETCH_TASKS_BY_TEAM_FAILURE = 'tasks/FETCH_TASKS_BY_TEAM_FAILURE';

export const FETCH_TASK_BY_ID = 'tasks/FETCH_TASK_BY_ID';
export const FETCH_TASK_BY_ID_SUCCESS = 'tasks/FETCH_TASK_BY_ID_SUCCESS';
export const FETCH_TASK_BY_ID_FAILURE = 'tasks/FETCH_TASK_BY_ID_FAILURE';

export const CREATE_TASK = 'tasks/CREATE_TASK';
export const CREATE_TASK_SUCCESS = 'tasks/CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'tasks/CREATE_TASK_FAILURE';

export const UPDATE_TASK = 'tasks/UPDATE_TASK';
export const UPDATE_TASK_SUCCESS = 'tasks/UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILURE = 'tasks/UPDATE_TASK_FAILURE';

export const DELETE_TASK = 'tasks/DELETE_TASK';
export const DELETE_TASK_SUCCESS = 'tasks/DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'tasks/DELETE_TASK_FAILURE';

export const SET_SELECTED_TASK = 'tasks/SET_SELECTED_TASK';
