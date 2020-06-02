import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createContainer } from 'react-tracked';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import Database from './components/Database';

const Stack = createStackNavigator();
/*
NOTES:
This app has mutliple screens - they are found in HomeScreen.js and LinkScreen.js
This file sets up the navigation tabs between the 2 screens.
Have a look at the expo docs (docs.expo.io) it's probably best to stick to their libraries
as much as we can, because this is a react-native app built using expo.
*/
// react global state from react-tracked
const useValue = ({ reducer, initialState }) => React.useReducer(reducer, initialState);
const { Provider, useTracked } = createContainer(useValue);
global.Provider = Provider
global.useTracked = useTracked

var initialState = {
  riddles:[]
};

const reducer = (state, action) => {
  if(action.type == "load"){
    return action.data
  } 
  if (action.type == "update"){
    return {...state, ...action.data}
  }
  if (action.type == "setRiddleStatus"){
    // update the riddle field
    state.riddles[action.riddleIndex] = {...state.riddles[action.riddleIndex], ...action.data}
    // update the database
    global.database.setRiddleStatus(state.riddles[action.riddleIndex].id,{
      r1:state.riddles[action.riddleIndex].r1,
      r2:state.riddles[action.riddleIndex].r2,
      r3:state.riddles[action.riddleIndex].r3,
      ...action.data
    })
    
    return state;
  }
  
};




export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  global.database = new Database();

  

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
        
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <Provider reducer={reducer} initialState={initialState}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
            <Stack.Navigator>
              <Stack.Screen name="Root" component={BottomTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
