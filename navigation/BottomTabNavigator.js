import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LocationsScreen from '../screens/LocationsScreen';
import AchievementsScreen from '../screens/AcheivementsScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route)});

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" />,
        }}
      />
      <BottomTab.Screen
        name="Locations"
        component={LocationsScreen}
        options={{
          title: 'Locations',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="map" />,

        }}
      />
      <BottomTab.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: 'Achievements',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="trophy" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Subject of a treasure hunt';
    case 'Locations':
      return 'Locations';
    case 'Achievements':
      return'Achievements';
  }
}
