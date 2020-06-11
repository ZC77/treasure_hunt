import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { RectButton, ScrollView,TouchableOpacity } from 'react-native-gesture-handler';
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
    else if(count == 2) icon = silver
    else if(count == 3) icon = gold
    completedRiddles.push(
      <Card key={index} style = {styles.cardLayout}>
        <TouchableOpacity style={{flexDirection:"row"}}>
          <Image source={icon} style = {styles.image} />
          <View style ={{flex:4,paddingLeft:5}}>
            <Text style = {styles.textHeading}>{riddle.title}</Text>
            <Text style = {styles.textBody}>{riddle.blurb}</Text>
          </View>
        </TouchableOpacity>
      </Card>
    )
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {completedRiddles.length == 0 
      ? 
        <Text style = {styles.textTitle}>Nothing to show.... yet</Text>
      :
        completedRiddles
      }
    </ScrollView>
  );
}
// JUST A REMINDER
// JustifyContent = alignment on along the primary axis (Y axis)
// AlignItems = alignment along the secodary axis (X axis)
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

  textTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    marginVertical: '70%',
    textAlign: 'center'

  },

  textBody: {
    alignItems: 'flex-start',
    justifyContent: 'space-around'

  },

  image: {
    width: 30,
    height:50,
    resizeMode: 'contain',
    flex:1,
  },
})

