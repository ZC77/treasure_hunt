import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
// Props.children allows us to apply this view to anything wrapped around the opening and closing tags of <Card>
// {...styles.Card, ...props.style} allows us to merge the styles in the card styleSheet with any style props being passed in
// If there are any duplicate style settings the props will override the ones in the styleSheet. 
return(<View style = {{...styles.card, ...props.style}}>{props.children}</View>); 
};

//StyleSheet (card = styles of our card)
const styles = StyleSheet.create ({
    card: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        backgroundColor: '#fbfbfb',
        padding: 20,
        borderRadius: 12,

        //Elevation only available on Android
        elevation: 15
    }
})

export default Card;