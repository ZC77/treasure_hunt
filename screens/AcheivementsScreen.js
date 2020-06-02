import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import Card from "../ui_elements/card"

const bronze = require("../assets/images/bronzeHD.png")
const silver = require("../assets/images/silverHD.png")
const gold   = require("../assets/images/goldHD.png")

export default function AchievementsScreen() {
  //global state
  const [state, dispatch] = global.useTracked();
  
  var completedRiddles = [];
  var index = -1;
  for(var riddle of state.riddles){
    index++;
    var count = 0;
    var icon;
    if(riddle.r1 == true) count++;
    if(riddle.r2 == true) count++;
    if(riddle.r3 == true) count++;
    if (count == 0) continue; // only show completed riddles
    else if(count == 1) icon = bronze
    else if(count==2) icon = silver
    else if(count==3) icon = gold
    completedRiddles.push(
      <Card key={index}>
        <Image source={icon} />
        <Text>{riddle.title}</Text>
        <Text>{riddle.blurb}</Text>
      </Card>
    )
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {completedRiddles.length == 0 
      ? 
        <Text>Nothing to show.... yet</Text>
      :
        completedRiddles
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
