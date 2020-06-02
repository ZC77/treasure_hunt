import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

import Card from '../ui_elements/card';

const Popup = () => {
  Alert.alert('Clicked', 'You pressed on a card!')
}

export default function LocationScreen() {
  return (
    <View style = {styles.screen}>
      <Text >In development!</Text>

        <Card style = {styles.cardLayout}>
        <TouchableOpacity onPress = {Popup}>
          <Text style = {styles.textHeading}>Libary</Text>
          <Text style = {styles.textBody}>Example Location description</Text>
          </TouchableOpacity>
        </Card>

        <Card style = {styles.cardLayout}>
        <TouchableOpacity>
          <Text style = {styles.textHeading}>Large Scale Lab</Text>
          <Text style = {styles.textBody}>Example Location description</Text>
          </TouchableOpacity>
        </Card>

        <Card style = {styles.cardLayout}>
        <TouchableOpacity>
          <Text style = {styles.textHeading}>R Block</Text>
          <Text style = {styles.textBody}>Example Location description</Text>
          </TouchableOpacity>
        </Card>

        <Card style = {styles.cardLayout}>
        <TouchableOpacity>
          <Text style = {styles.textHeading}>S Block</Text>
          <Text style = {styles.textBody}>Example Location description</Text>
          </TouchableOpacity>
        </Card>

    </View>
  );
}

// JUST A REMINDER
// JustifyContent = alignment on along the primary axis (Y axis)
// AlignItems = alignment along the secodary axis (X axis)
// By default flexdirection is set to column, changing it to row will make secondary axis become primary
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,


  },

  cardLayout: {
    margin: 10,
    width: '92%'
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

  }


});
