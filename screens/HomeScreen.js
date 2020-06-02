import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import * as Permissions from 'expo-permissions';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

import Map from  "../components/Map"

global.riddles = [
  {id:"1",lat:-37.7881,long:175.31595,message:"Title of riddle"},
  {id:"2",lat:-37.7843,long:175.315,message:"Riddle completed ok"},
  {id:"4",lat:-37.7910,long:175.3155,message:"Unsolved Riddle Title"},
  {id:"5",lat:-37.7830,long:175.314,message:"Title of Event"},
  {id:"6",lat:-37.7879,long:175.3145,message:"Title of basic completed riddle"}
]

export default function HomeScreen() {
  // the reference to the map
  this.map;

  // state stuff (when you use setLocation, React updates places in the page where you used location.
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [lat, setlat] = React.useState(null);
  const [lng, setlng] = React.useState(null);
  const [markerInfo, setMarkerInfo] = React.useState("");
  
  // EVENTS
  onMapLoaded = ()=>{
    console.log("MAPLOADED")
    global.riddles.forEach((riddle)=>{
      global.database.getRiddleStatus(riddle.id).then((result)=>{
        riddle.r1 = result.r1;
        riddle.r2 = result.r2;
        riddle.r3 = result.r3;
        // display map icon based on number of riddles solved
        var count = 0;
        if(riddle.r1 == true) count++;
        if(riddle.r2 == true) count++;
        if(riddle.r3 == true) count++;
        var icon = Map.icons.qMark
        if(count== 1) icon = Map.icons.bronze
        else if(count==2) icon = Map.icons.silver
        else if(count==3) icon = Map.icons.gold

        riddle.marker = this.map.addMarker(riddle.lat,riddle.long,icon,riddle.message,)
      })
    })
    this.map.changeMarkerIcon(riddles[1].marker,Map.icons.silver)
    this.map.changeMarkerPopup(riddles[4].marker,"Changed Title of Riddle")
  }

  onLocationUpdate = (newlat,newlng)=>{
    setlat(newlat);
    setlng(newlng);
  }

  onLocationError = (err) =>{
    setErrorMsg(err);
  }

  onMarkerClick = (marker)=>{
    var riddle = global.riddles.find(element => (element.marker == marker ))
    console.log(marker)
    //if(riddle == undefined) return;
    setMarkerInfo(riddle.message);
  }
  
  return (
    <View style={styles.container}>
      <View style={{height:400}}>
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

      {/*The text at the bottom*/}
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> 
        <Text>Lattitude:{lat} Longitude:{lng}</Text>
        <Text>Last selected marker ID: {markerInfo}</Text>
        <Text>{errorMsg}</Text>
      </ScrollView>

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

});
