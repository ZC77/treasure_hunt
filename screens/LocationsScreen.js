import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
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
      
      <Card key={index} style = {styles.cardLayout}>
        <TouchableOpacity>
          <Image source={qmark} style = {styles.image} />

          <Text style = {styles.textHeading}>{riddle.title}</Text>
          <Text style = {styles.textBody}>{riddle.blurb}</Text>
        </TouchableOpacity>
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
// JUST A REMINDER
// JustifyContent = alignment on along the primary axis (Y axis)
// AlignItems = alignment along the secondary axis (X axis)
// By default flexdirection is set to column, changing it to row will make secondary axis become primary

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  cardLayout: {
    margin: 10,
    width: '92%',
  },
  textHeading: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    fontSize: 22

  },

  textBody: {
    alignItems: 'flex-start',
    justifyContent: 'space-around'

  },

  image: {
    width: 50,
    height: 70,
  },
})

