import * as T from './types';

const initialState: T.TasksState = {
  data: [],
  selectedTask: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 10 },
};

type Action = { type: string; payload?: any };

export default function tasksReducer(state = initialState, action: Action): T.TasksState {
  switch (action.type) {
    case T.FETCH_TASKS:
    case T.FETCH_TASKS_BY_TEAM:
    case T.FETCH_TASK_BY_ID:
    case T.CREATE_TASK:
    case T.UPDATE_TASK:
    case T.DELETE_TASK:
      return { ...state, loading: true, error: null };

    case T.FETCH_TASKS_SUCCESS:
    case T.FETCH_TASKS_BY_TEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        pagination: {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        },
      };

    case T.FETCH_TASK_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedTask: action.payload };

    case T.CREATE_TASK_SUCCESS:
      return { ...state, loading: false, data: [action.payload, ...state.data] };

    case T.UPDATE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedTask: action.payload,
        data: state.data.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };

    case T.DELETE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedTask: null,
        data: state.data.filter((t) => t.id !== action.payload),
      };

    case T.FETCH_TASKS_FAILURE:
    case T.FETCH_TASKS_BY_TEAM_FAILURE:
    case T.FETCH_TASK_BY_ID_FAILURE:
    case T.CREATE_TASK_FAILURE:
    case T.UPDATE_TASK_FAILURE:
    case T.DELETE_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case T.SET_SELECTED_TASK:
      return { ...state, selectedTask: action.payload };

    default:
      return state;
  }
}
