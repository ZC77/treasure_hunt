import React from 'react'
import {View, Text, StyleSheet} from 'react-native';

const AchievementScreen = props => {

return(
    <View style = {styles.container}>
        <Text>This is the achievement Screen</Text>
    </View>
);


}

export default AchievementScreen;

// JUST A REMINDER
// JustifyContent = alignment on along the primary axis (Y axis)
// AlignItems = alignment along the secodary axis (X axis)
// By default flexdirection is set to column, changing it to row will make secondary axis become primary
const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        margin: 20
    }
})