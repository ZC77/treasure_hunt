import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import Card from "../ui_elements/card"

const qmark = require("../assets/images/qmarkHD.png")


export default function LocationsScreen() {
  //global state
  const [state, dispatch] = global.useTracked();
  
  var uncompletedRiddles = [];
  var index = -1;
  for(var riddle of state.riddles){
    index++;
    var count = 0;
    if(riddle.r1 == true) count++;
    if(riddle.r2 == true) count++;
    if(riddle.r3 == true) count++;
    if (count != 0) continue; // only show uncompleted riddles
    uncompletedRiddles.push(
      <Card key={index}>
        <Image source={qmark} />
        <Text>{riddle.title}</Text>
        <Text>{riddle.blurb}</Text>
      </Card>
    )
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {uncompletedRiddles.length == 0 
      ? 
        <Text>It seems as though you have completed everything!</Text>
      :
        uncompletedRiddles
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
})

