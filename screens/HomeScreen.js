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
  const [riddleIndex, setRiddleIndex] = React.useState(0); // stores the index of the riddle currently being displayed in the modal
  const [unsolvedIndex,setUnsolvedIndex] = React.useState(0); // stores the index of the next unsolved riddle


  // To toggle modal visibility
  const [ModalStatus, setModalStatus] = React.useState(false);

  // To store user answers (3 riddles per location)
  const [ans1, setAns1] = React.useState('');
  const [ans2, setAns2] = React.useState('');
  const [ans3, setAns3] = React.useState('');
  
  // EVENTS
  const onMapLoaded = async ()=>{
    //get the riddles
    riddles = await global.database.fetchRiddles()
    var discoveredPrevRiddle = true;
    var index = -1
    for(var riddle of riddles){
      index++;
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
      if(discoveredPrevRiddle)riddle.marker = this.map.addMarker(riddle.generalLocationX,riddle.generalLocationY,icon,riddle.title,)
      // if this riddle is unsolved and the previous riddle was, this is the next unsolved riddle 
      if(count == 0 && discoveredPrevRiddle) setUnsolvedIndex(index);
      // if this riddle is unsolved, don't show the rest of the riddles)
      if(count == 0) discoveredPrevRiddle = false;
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
  // when a marker is clicked (they click More... on the popup), show the modal,
  // so that the person can answer the riddles.
  onMarkerClick = (marker)=>{
    var ri = state.riddles.findIndex(element => (element.marker == marker ))
    //if(riddle == undefined) return;
    setAns1('');
    setAns2('');
    setAns3('');
    setRiddleIndex(ri)
    setModalStatus(true)
  }

  // this is run when they have completed a riddle and need to see the next riddle location
  // on the map.
  showNextLocation= ()=>{
    var index = riddleIndex;
    if(state.riddles[index+1] != undefined && index == unsolvedIndex){
      // we need to show the next location, because this index was just solved
      setUnsolvedIndex(index + 1);
      // display the map icon
      state.riddles[index+1].marker = this.map.addMarker(state.riddles[index+1].generalLocationX,
        state.riddles[index+1].generalLocationY,
        Map.icons.qMark,
        state.riddles[index+1].title,
      )
    }
  }

  // Clears user input when they exit the modal
  const returnToHome = () => {
    setModalStatus(false)
    setAns1('');
    setAns1('');
    setAns1('');
  }

  // check if riddle 1 is correct, update database + status if it is correct
  const checkR1 = () => {
     if (ans1 != (state.riddles[riddleIndex].answer1)){
      Alert.alert('Incorrect answer', 'Try that one again!', [{text: 'OK'}])
      setAns1('')
      return;
    }
    Alert.alert('Correct!', 'Good Job!', [{text: 'OK'}])
    updateIcon(); // set the icon to gold, silver or bronze - whatevers appropriate.
    dispatch({
      type:"setRiddleStatus",
      riddleIndex:riddleIndex,
      data:{r1:true,}
    })
    showNextLocation()
    setAns1('');
  }
  //same for R2
  const checkR2 = () => {
    if (ans2 != (state.riddles[riddleIndex].answer2)){
     Alert.alert('Incorrect answer', 'Try that one again!', [{text: 'OK'}])
     setAns2('')
     return;
   }
   Alert.alert('Correct!', 'Good Job!', [{text: 'OK'}])
   updateIcon(); // set the icon to gold, silver or bronze - whatevers appropriate.
   dispatch({
     type:"setRiddleStatus",
     riddleIndex:riddleIndex,
     data:{r2:true,}
   })
   showNextLocation()
   setAns2('');
  }
  // same for R3
  const checkR3 = () => {
    if (ans3 != (state.riddles[riddleIndex].answer3)){
    Alert.alert('Incorrect answer', 'Try that one again!', [{text: 'OK'}])
    setAns3('')
    return;
  }
  Alert.alert('Correct!', 'Good Job!', [{text: 'OK'}])
  updateIcon(); // set the icon to gold, silver or bronze - whatevers appropriate.
  dispatch({
    type:"setRiddleStatus",
    riddleIndex:riddleIndex,
    data:{r3:true,}
  })
  showNextLocation()
  setAns3('');
  }
  // update the icon, so when they answer a riddle the riddle medal is always the right color
  const updateIcon = ()=>{
    // bronze if 1, silver if 2, gold if 3
    var count = 0;
    if(state.riddles[riddleIndex].r1) count++;
    if(state.riddles[riddleIndex].r2) count++;
    if(state.riddles[riddleIndex].r3) count++;
    count++;// I don't think the state has updated in time, so I'm just gonna add 1 to count here.
    if(count == 0){
      this.map.changeMarkerIcon(state.riddles[riddleIndex].marker,Map.icons.qMark)
    } else if(count == 1){
      this.map.changeMarkerIcon(state.riddles[riddleIndex].marker,Map.icons.bronze)
    } else if(count == 2){
      this.map.changeMarkerIcon(state.riddles[riddleIndex].marker,Map.icons.silver)
    } else if(count == 3){
      this.map.changeMarkerIcon(state.riddles[riddleIndex].marker,Map.icons.gold)
    }
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
          <TouchableOpacity onPress = {() => {setModalStatus(true);setRiddleIndex(unsolvedIndex)}}> 
          <Text style = {{...styles.textHeading, color: 'white', textAlign: 'center'}}>Current Objective </Text> 
          {state.riddles[riddleIndex] == undefined ? <Text style = {{...styles.textBody, color: 'white', textAlign: 'center', fontStyle:'italic', fontSize: 20}}>content loading...</Text>:
          <Text style = {{...styles.textBody, color: 'white', textAlign: 'center', fontStyle:'italic', fontSize: 20}}>Discover {state.riddles[unsolvedIndex].title}</Text> }
          <Text style = {{...styles.textBody, color: 'white', marginTop: 8, textAlign: 'center', fontSize: 12}}>Touch to show riddles</Text>    
          </TouchableOpacity>
        </Card>

        </View>


      <InGameModal visible = {ModalStatus} onReturn = {returnToHome}>
      {state.riddles[riddleIndex] == undefined ? <Text>content loading...</Text>:
      <View style = {styles.cardContainer}>

        <Text style = {styles.textTitle}>{state.riddles[riddleIndex].title}</Text>

        <Card style = {{...styles.statsCard,backgroundColor:state.riddles[riddleIndex].r1 ? "#d9b484":"#fbfbfb"}}>
          <Text style = {styles.textHeading}>Riddle 1</Text>
          <Text style = {styles.textBody}>{state.riddles[riddleIndex].riddle1}</Text> 

          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput 
          style = {styles.input}
          placeholder = 'Your answer here..'
          placeholderTextColor = "black"
          blurOnSubmit
          autoCapitalize = 'none'
          autoCorrect = {false}
          onChangeText = {setAns1}
          value = {ans1}
          />
          <Button title = "check" onPress = {checkR1}/>
          </View>
        </Card>

        <Card style = {{...styles.statsCard,backgroundColor:state.riddles[riddleIndex].r2 ? "#b3b3b3":"#fbfbfb"}}>
          <Text style = {styles.textHeading}>Riddle 2</Text>
          <Text style = {styles.textBody}>{state.riddles[riddleIndex].riddle2}</Text>

          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput 
          style = {styles.input}
          placeholder = 'Your answer here..'
          placeholderTextColor = "black"
          blurOnSubmit
          autoCapitalize = 'none'
          autoCorrect = {false}
          onChangeText = {setAns2}
          value = {ans2}
          />
          <Button title = "check" onPress = {checkR2}/>
          </View>
        </Card>

        <Card style = {{...styles.statsCard,backgroundColor:state.riddles[riddleIndex].r3 ? "#edd77e":"#fbfbfb"}}>
          <Text style = {styles.textHeading}>Riddle 3</Text>
          <Text style = {styles.textBody}>{state.riddles[riddleIndex].riddle3}</Text>

          <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput 
          style = {styles.input}
          placeholder = 'Your answer here..'
          placeholderTextColor = "black"
          blurOnSubmit
          autoCapitalize = 'none'
          autoCorrect = {false}
          onChangeText = {setAns3}
          value = {ans3}
          />
          <Button title = "check" onPress = {checkR3}/>
          </View>
        </Card>

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
    marginTop: 15,
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
    marginVertical: 5,
    width: '75%'
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
