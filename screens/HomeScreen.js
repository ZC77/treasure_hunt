import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import * as Permissions from 'expo-permissions';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Alert, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import InGameModal from '../screens/InGameModal.js'

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


  // To toggle modal visibility
  const [inGame, setInGame] = React.useState(false);

  // To store user answers (3 riddles per location)
  const [ans1, setAns1] = React.useState('');
  const [ans2, setAns2] = React.useState('');
  const [ans3, setAns3] = React.useState('');
  
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

  const confirmInputHandler = () => {

    let answer1 = ans1
    let answer2 = ans2
    let answer3 = ans3

     if (answer1 != (state.riddles[riddleIndex].answer1))
    {
      Alert.alert('Incorrect answer', 'Try that one again!', [{text: 'OK', onPress: resetInputHandler}])
      return;
    }

    Alert.alert('Location unlocked', "You've unlocked the library!", [{text: 'Yay!', onPress: onRiddleAnswerEntered}])
    setInGame(false);
    setRiddleIndex(riddleIndex + 1)
    setAns1('');
  }

  const resetInputHandler = () => {
    setAns1('');
    setAns2('');
    setAns3('');
  }

  return (
    
    <View style={styles.container}>

        <View style = {styles.cardContainer}>
          <Card style = {styles.mapCard}>
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


        <Card style = {styles.objectiveCard}>    
          <TouchableOpacity onPress = {() => setInGame(true)}> 
          <Text style = {{...styles.textHeading, color: 'white', textAlign: 'center'}}>Current Objective </Text> 
          {state.riddles[riddleIndex] == undefined ? <Text>content loading...</Text>:
          <Text style = {{...styles.textBody, color: 'white', textAlign: 'center', fontStyle:'italic', fontSize: 20}}>Discover {state.riddles[riddleIndex].title}</Text> }
          <Text style = {{...styles.textBody, color: 'white', marginTop: 8, textAlign: 'center', fontSize: 12}}>PRESS TO START</Text>    
          </TouchableOpacity>
        </Card>
        </View>


      <InGameModal visible = {inGame} onReturn = {() => setInGame(false)}>
      {state.riddles[riddleIndex] == undefined ? <Text>content loading...</Text>:
      <View style = {styles.cardContainer}>

        <Text style = {styles.textTitle}>{state.riddles[riddleIndex].title}</Text>

        <Card style = {styles.statsCard}>
            <Text style = {styles.textHeading}>Riddle 1</Text>
            <Text style = {styles.textBody}>{state.riddles[riddleIndex].riddle1}</Text> 

        <TextInput 
        style = {styles.input}
        placeholder = 'Your answer here..'
        blurOnSubmit
        autoCapitalize = 'none'
        autoCorrect = {false}
        onChangeText = {setAns1}
        value = {ans1}
        />
        </Card>

        <Card style = {styles.statsCard}>
            <Text style = {styles.textHeading}>Riddle 2</Text>
            <Text style = {styles.textBody}>{state.riddles[riddleIndex].riddle2}</Text>

        <TextInput 
        style = {styles.input}
        placeholder = 'Your answer here..'
        blurOnSubmit
        autoCapitalize = 'none'
        autoCorrect = {false}
        onChangeText = {setAns2}
        value = {ans2}
        />
        </Card>

        <Card style = {styles.statsCard}>
            <Text style = {styles.textHeading}>Riddle 3</Text>
            <Text style = {styles.textBody}>{state.riddles[riddleIndex].riddle3}</Text>

        <TextInput 
        style = {styles.input}
        placeholder = 'Your answer here..'
        blurOnSubmit
        autoCapitalize = 'none'
        autoCorrect = {false}
        onChangeText = {setAns3}
        value = {ans3}
        />
        </Card>

        <View style = {styles.buttonContainer}>
        <Button title = "confirm answers" onPress = {confirmInputHandler}/>
        </View>


      </View>
}
      </InGameModal>

    </View>
  );
}

// JUST A REMINDER
// JustifyContent = alignment on along the primary axis (Y axis)
// AlignItems = alignment along the secodary axis (X axis)
// By default flexdirection is set to column, changing it to row will make secondary axis become primary
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
    marginTop: 10,
    padding: 15
  },

  mapCard: {
    width: '92%',
    justifyContent: 'space-between',
    padding: 0,
    overflow: 'hidden',
    marginTop: 15
  },

  objectiveCard: {
    width: '92%',
    justifyContent: 'space-between',
    alignItems:'center',
    marginTop: 10,
    padding: 15,
    backgroundColor: Colors.primary

  },

  cardContainer: {
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 12,
  },

  buttonContainer : {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },

  input: {
    height: 30,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginVertical: 5
  },

  textHeading: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5

  },

  textTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 10

  },

  textBody: {
    alignItems: 'flex-start',
    justifyContent: 'space-around'

  }

});
