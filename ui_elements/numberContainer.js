import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors'

const NumberContainer = props => {
return(
    <View style = {styles.container}>
        <Text style = {styles.text}>{props.children}</Text>
    </View>
)
}

export default NumberContainer; 

const styles = StyleSheet.create({

    container: {
        borderWidth: 2, 
        borderColor: Colors.accent,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    text: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});