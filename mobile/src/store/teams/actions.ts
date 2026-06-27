import * as T from './types';

export const fetchTeams = (params?: { page?: number; limit?: number; search?: string }) => ({
  type: T.FETCH_TEAMS as typeof T.FETCH_TEAMS,
  payload: params,
});

export const fetchTeamsSuccess = (data: T.Pagination) => ({
  type: T.FETCH_TEAMS_SUCCESS as typeof T.FETCH_TEAMS_SUCCESS,
  payload: data,
});

export const fetchTeamsFailure = (error: string) => ({
  type: T.FETCH_TEAMS_FAILURE as typeof T.FETCH_TEAMS_FAILURE,
  payload: error,
});

export const createTeam = (data: { name: string; color: string }, onSuccess?: () => void) => ({
  type: T.CREATE_TEAM as typeof T.CREATE_TEAM,
  payload: data,
  onSuccess,
});

export const createTeamSuccess = (team: T.Team) => ({
  type: T.CREATE_TEAM_SUCCESS as typeof T.CREATE_TEAM_SUCCESS,
  payload: team,
});

export const createTeamFailure = (error: string) => ({
  type: T.CREATE_TEAM_FAILURE as typeof T.CREATE_TEAM_FAILURE,
  payload: error,
});

export const updateTeam = (id: string, data: Partial<T.Team>, onSuccess?: () => void) => ({
  type: T.UPDATE_TEAM as typeof T.UPDATE_TEAM,
  payload: { id, data },
  onSuccess,
});

export const updateTeamSuccess = (team: T.Team) => ({
  type: T.UPDATE_TEAM_SUCCESS as typeof T.UPDATE_TEAM_SUCCESS,
  payload: team,
});

export const updateTeamFailure = (error: string) => ({
  type: T.UPDATE_TEAM_FAILURE as typeof T.UPDATE_TEAM_FAILURE,
  payload: error,
});

export const deleteTeam = (id: string, onSuccess?: () => void) => ({
  type: T.DELETE_TEAM as typeof T.DELETE_TEAM,
  payload: id,
  onSuccess,
});

export const deleteTeamSuccess = (id: string) => ({
  type: T.DELETE_TEAM_SUCCESS as typeof T.DELETE_TEAM_SUCCESS,
  payload: id,
});

export const deleteTeamFailure = (error: string) => ({
  type: T.DELETE_TEAM_FAILURE as typeof T.DELETE_TEAM_FAILURE,
  payload: error,
});

export const setSelectedTeam = (team: T.Team | null) => ({
  type: T.SET_SELECTED_TEAM as typeof T.SET_SELECTED_TEAM,
  payload: team,
});
