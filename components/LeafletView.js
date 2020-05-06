import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text } from 'react-native';
import { ProgressBarAndroid } from 'react-native';
// here all the map code can go for talking to the webview
// https://leafletjs.com/examples/quick-start/
// https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#react-native-webview-guide

export default function LeafletView(props){
    const webviewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LEAFLET MAP!!!</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
   <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>
   <Style>
       #mapid { height: 600px; 
       width:100%;
       }
       body, html{
           margin:0;padding:0;
       }
   </Style>
</head>
<body>
    <div id="mapid"></div>
</body>
<script>  
//https://leafletjs.com/examples/quick-start/
var map = L.map('mapid').setView([-37.788047, 535.315962], 15);
L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 19,
    id: 'wikimedia/osm',
    tileSize: 256,
    zoomOffset: 0,
}).addTo(map);
</script>
</html>
    `

    return(
        <WebView
            source={{html:webviewHTML}}
        ></WebView> 
    )
}