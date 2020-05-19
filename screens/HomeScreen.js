import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

import LeafletView from  "../components/LeafletView"


export default function HomeScreen() {
  // holds our current location
  this.location = {
    lat:0,
    long:0,
  }
  // the reference to the Leafletview
  this.leafletView;
  //
  var markers = [
    {lat:-37.7881,long:535.31597},
  ]

  // state stuff (when you use setLocation, React updates places in the page where you used location.
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [latlong, setlatlong] = React.useState(null);


  // doing the location
  React.useEffect(() => {
    Location.requestPermissionsAsync()
    .then(
      status => Location.getCurrentPositionAsync({})
    ).then(location=>{
      this.location.lat = location.coords.latitude
      this.location.long = location.coords.longitude;
      setlatlong(location.coords.latitude+ "   " + location.coords.longitude)
      this.leafletView.updateLocation(this.location.lat,this.location.long)
      setErrorMsg("");
    }).catch(err=>{
      setErrorMsg('Something went wrong. ' + err);
    })

    
  });



  // EVENTS
  function onLeafletviewResolved(reference){
    this.leafletView = reference;
    // initiliser for leafletView -anything we want to do onload goes here
    setTimeout(()=>{
      for(marker of markers){
        this.leafletView.addMarker(marker.lat,marker.long,this.leafletView.icons.gold,"this is an marker")
      }
    },1000)
    

  }
  // location button
  this.centerOnLocation = ()=>{
    this.leafletView.panTo(this.location.lat,this.location.long);
  }
  
  return (
    <View style={styles.container}>
      <View style={{height: 400}} >
      <LeafletView
      // we have to use a ref, because we can't always pass stuff in as props because
      // we don't want to create a new instance of a webview every time we change something
      ref={onLeafletviewResolved}
      ></LeafletView>
      </View>
      <Button onPress={this.centerOnLocation} title="◎"></Button>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> 
        
        <Text>{errorMsg}</Text>
        <Text>{latlong}</Text>
        
        <View style={styles.helpContainer}>
          <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
            <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
