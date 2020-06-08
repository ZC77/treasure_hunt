import React from 'react'
import {View,ScrollView, Text, TextInput, Button, StyleSheet, Modal} from 'react-native'

import Colors from "../constants/Colors"


const InGameModal = props => {

    return (
        <Modal visible = {props.visible} animationType = 'slide'>
            <View style = {styles.Container}>
                {props.children}
                <View style = {styles.Button}>
                <Button title = "Return" onPress = {props.onReturn} style ={{color: Colors.accent}}/>
                </View>

            </View>
        </Modal>
    );

}

export default InGameModal;

// JUST A REMINDER
// JustifyContent = alignment on along the primary axis (Y axis)
// AlignItems = alignment along the secodary axis (X axis)
// By default flexdirection is set to column, changing it to row will make secondary axis become primary
const styles = StyleSheet.create({
    Container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        flex: 1
    },

    TextHeading: {
        fontSize: 25,
        fontWeight: 'bold',
        margin: 10

    },

    Button: {
        marginVertical: 20,
        justifyContent: "space-evenly"

    }
})