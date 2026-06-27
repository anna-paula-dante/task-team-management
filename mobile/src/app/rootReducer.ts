import { combineReducers } from 'redux';
import teamsReducer from '../store/teams/reducer';
import tasksReducer from '../store/tasks/reducer';

const rootReducer = combineReducers({
  teams: teamsReducer,
  tasks: tasksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
