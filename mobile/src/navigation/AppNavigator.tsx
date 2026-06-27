import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './routes';
import { colors } from '../theme';

import TeamsListScreen from '../screens/Teams/TeamsListScreen';
import CreateTeamScreen from '../screens/Teams/CreateTeamScreen';
import EditTeamScreen from '../screens/Teams/EditTeamScreen';
import TasksListScreen from '../screens/Tasks/TasksListScreen';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import EditTaskScreen from '../screens/Tasks/EditTaskScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="TeamsList" component={TeamsListScreen} />
        <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
        <Stack.Screen name="EditTeam" component={EditTeamScreen} />
        <Stack.Screen name="TasksList" component={TasksListScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
