import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import * as Permissions from 'expo-permissions';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

import Map from  "../components/Map"
import Card from "../ui_elements/card"
import Colors from "../constants/Colors"

export default function HomeScreen() {
  // the reference to the map
  this.map;

  // global state
  const [state, dispatch] = global.useTracked();

  // state stuff (when you use setLocation, React updates places in the page where you used location.
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [lat, setlat] = React.useState(null);
  const [lng, setlng] = React.useState(null);
  const [riddleIndex, setRiddleIndex] = React.useState(0);
  
  // EVENTS
  const onMapLoaded = async ()=>{
    //get the riddles
    riddles = await global.database.fetchRiddles()
    var discoveredRiddle = true;
    for(var riddle of riddles){
      // get the riddle statuses and add them to the riddle state
      result = await global.database.getRiddleStatus(riddle.id)
      riddle.r1 = result.r1;
      riddle.r2 = result.r2;
      riddle.r3 = result.r3;
      // display map icon based on number of riddles solved
      var count = 0;
      if(riddle.r1 == true) count++;
      if(riddle.r2 == true) count++;
      if(riddle.r3 == true) count++;
      var icon = Map.icons.qMark
      if(count == 1) icon = Map.icons.bronze
      else if(count==2) icon = Map.icons.silver
      else if(count==3) icon = Map.icons.gold
      if(discoveredRiddle)riddle.marker = this.map.addMarker(riddle.generalLocationX,riddle.generalLocationY,icon,riddle.title,)
      // if this riddle is unsolved, don't show the rest of the riddles)
      if(count == 0) discoveredRiddle = false;
      
    }
    //now we've changed the riddles to how we like, update the state
    dispatch({type:"update",data:{riddles:riddles}});
    

  }
  onLocationUpdate = (newlat,newlng)=>{
    setlat(newlat);
    setlng(newlng);
  }

  onLocationError = (err) =>{
    setErrorMsg(err);
  }

  onMarkerClick = (marker)=>{
    var ri = state.riddles.findIndex(element => (element.marker == marker ))
    //if(riddle == undefined) return;
    setRiddleIndex(ri)
  }

  onRiddleAnswerEntered = ()=>{
  /**
     * This is an example of how you would set a riddle to found in the database
     * once the user has put in the correct input
     * note: you need the index of the riddle you are updating
     */
    var index = 0;
    dispatch({
      type:"setRiddleStatus",
      riddleIndex:index,
      data:{
        r1:true,
      }
    })
    // at the same time, you need to update the map icon, and show the next item in the list
    console.log(state.riddles[0])
    this.map.changeMarkerIcon(state.riddles[index].marker,Map.icons.bronze)
    if(state.riddles[index+1] != undefined)
    this.map.addMarker(state.riddles[index+1].generalLocationX,
      state.riddles[index+1].generalLocationY,
      Map.icons.qMark,
      state.riddles[index].title,
    )
  }
  
  

  return (
    
    <View style={styles.container}>
      <View style = {styles.cardContainer}>
      <Card style = {styles.statsCard}>
        <View style={{height:350}}>
        {/*THE MAP*/}
          <Map 
          // we have to use a ref, because we can't always pass stuff in as props because
          // we don't want to create a new instance of a webview every time we change something
          ref={(ref)=>{this.map = ref}}
          onLoad={onMapLoaded}
          onMarkerClick={onMarkerClick}
          onLocationUpdate={onLocationUpdate}
          onLocationError={onLocationError}
          ></Map>
        </View>
      </Card>
      </View>
      <View style = {styles.buttonContainer}>
      <Button title = "Start game" color = {Colors.primary} onPress={onRiddleAnswerEntered/*Just for testing*/}></Button>
      </View>
      {/*Turn this into a modal with riddle information??????*/}
      <View style = {styles.cardContainer}>
        <Card style = {styles.statsCard}>
          {state.riddles[riddleIndex] == undefined ? <Text>content loading...</Text>:
          <ScrollView>
            <Text>{state.riddles[riddleIndex].title}</Text>
            <Text>{state.riddles[riddleIndex].blurb}</Text>
            <Text>{state.riddles[riddleIndex].riddle1}</Text>
            <Text>{state.riddles[riddleIndex].answer1}</Text>
            <Text>{state.riddles[riddleIndex].riddle2}</Text>
            <Text>{state.riddles[riddleIndex].riddle1}</Text>
          </ScrollView>
          }
        </Card>
      </View>

      
      <Text>{errorMsg}</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop:30,
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/2,
  },

  text: {
    color: 'black',
  },

  statsCard: {
    width: '92%',
    justifyContent: 'space-between',
    
  },

  cardContainer: {
    alignItems: 'center',
    paddingVertical: 10
  },

  buttonContainer : {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 25
  }

});
