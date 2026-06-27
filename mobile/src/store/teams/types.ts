export interface Team {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  data: Team[];
  total: number;
  page: number;
  limit: number;
}

export interface TeamsState {
  data: Team[];
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
  pagination: { total: number; page: number; limit: number };
}

export const FETCH_TEAMS = 'teams/FETCH_TEAMS';
export const FETCH_TEAMS_SUCCESS = 'teams/FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_FAILURE = 'teams/FETCH_TEAMS_FAILURE';

export const CREATE_TEAM = 'teams/CREATE_TEAM';
export const CREATE_TEAM_SUCCESS = 'teams/CREATE_TEAM_SUCCESS';
export const CREATE_TEAM_FAILURE = 'teams/CREATE_TEAM_FAILURE';

export const UPDATE_TEAM = 'teams/UPDATE_TEAM';
export const UPDATE_TEAM_SUCCESS = 'teams/UPDATE_TEAM_SUCCESS';
export const UPDATE_TEAM_FAILURE = 'teams/UPDATE_TEAM_FAILURE';

export const DELETE_TEAM = 'teams/DELETE_TEAM';
export const DELETE_TEAM_SUCCESS = 'teams/DELETE_TEAM_SUCCESS';
export const DELETE_TEAM_FAILURE = 'teams/DELETE_TEAM_FAILURE';

export const SET_SELECTED_TEAM = 'teams/SET_SELECTED_TEAM';
