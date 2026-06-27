import * as T from './types';

const initialState: T.TeamsState = {
  data: [],
  selectedTeam: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 10 },
};

type Action = { type: string; payload?: any };

export default function teamsReducer(state = initialState, action: Action): T.TeamsState {
  switch (action.type) {
    case T.FETCH_TEAMS:
    case T.CREATE_TEAM:
    case T.UPDATE_TEAM:
    case T.DELETE_TEAM:
      return { ...state, loading: true, error: null };

    case T.FETCH_TEAMS_SUCCESS:
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

    case T.CREATE_TEAM_SUCCESS:
      return { ...state, loading: false, data: [action.payload, ...state.data] };

    case T.UPDATE_TEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };

    case T.DELETE_TEAM_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter((t) => t.id !== action.payload),
      };

    case T.FETCH_TEAMS_FAILURE:
    case T.CREATE_TEAM_FAILURE:
    case T.UPDATE_TEAM_FAILURE:
    case T.DELETE_TEAM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case T.SET_SELECTED_TEAM:
      return { ...state, selectedTeam: action.payload };

    default:
      return state;
  }
}
