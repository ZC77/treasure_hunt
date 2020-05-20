import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text } from 'react-native';
import { ProgressBarAndroid } from 'react-native';
// here all the map code can go for talking to the webview
// https://leafletjs.com/examples/quick-start/
// https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#react-native-webview-guide

export default class LeafletView extends React.Component {
    
    webviewHTML = `
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
       #mapid { height: 370px; 
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
var map = L.map('mapid').setView([-37.788047, 175.315962], 15);
L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 19,
    id: 'wikimedia/osm',
    tileSize: 256,
    zoomOffset: 0,
}).addTo(map);
// create location marker
var locationMarker = L.marker([-37.780, 175.315]).addTo(map)
// create marker group
var markerGroup = L.layerGroup()
markerGroup.addTo(map)
// message posting
function postMsg(message){
    window.ReactNativeWebView.postMessage(message);
}
// icons
icon_gold = L.icon({iconUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAaQAAAGkBcaGY2AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK0SURBVEiJtZVLSJRhFIaf881o5lhq2AW7EGREkoaNQoQLJQJFTEhGu0AXCjcSRItcBVIERRBBESIWBobkrztBo0XhIoy0EFpUixYhSopO5qhJzpwWjnP5G62x6d395zvfc8534H+PsIJ0gFSEw0AeyhZAgVGUIXy8kFJ+LHdXYgL72YaTRuAEkLrMXR/KY/xcl4N8/SNY33Ae4R6wdqXXRBUQLoibp5FBY4PeQGiJAwqQhtKuAzTE7FgHOYfyKA6gXYpySopoD4H1HTvx8wFY8w9ggGmSyJH9jC2OIsC1BEAB1rHAVQDRftbjZBxITgAYwEc6WYYkyhIIBUjjOyUGZV8CoYtS8gyQnXCwkG1Q/AkHK34DjP4H8IjBMJRwsGFIdIBUYJzlzSZeTTLNZiOFzKK0JQgKykMpZWHxl35LNgE+Aa5/xE6QzG7Jx2sA5AAjKGdYNPLVKoBwVvLxQoRtShFdCA2rhPuBenHTvRSI8mNxc5uhnDvMOxf+Hmm+IVRIIU2RYfNbYm9BPk0VTl7vgbkVDG82BV7thQeVL8XNM/tx1GpSjycdGGPJlERh6wRsmgLXnKIi+FJgLANGN4AKgA+Xa6O0tkYtVmdUGdVyRMJOpwLDWTCc9R6RelTbgO225tKYmSkBepcfhTFVMR7dBxRLR0cfUAx8jJFz1B4IgbWuLgnVMtt5N1AmljUFIJb1BTgE9NvyqtQ21nDHXm8JkBH6FnlCZuYxsay5yAtiWZPAEeB5RDib6mp3bLBq5Bjuk5t7Wpqbf9qfGIT78Pkqgc5Q0OGIGmMYLFIRLHBLLOuiNDYGYkFD6T0988BxRFpiNBZc/9XVBRgziOpl6ey8uxLQLgWhpuYmqlcIBHZJV9fncMcORzmqJ+OFBjtT6ehoAC5hTGV0VY9nR7zAWNLa2tBi/gW199M0fAC2SAAAAABJRU5ErkJggg=="}) 


</script>
</html>
    `
    //constants
    icons = {
        gold:"icon_gold",
        default:"L.Icon.Default"
    }


    // METHODS
    panTo(lat , long){
        this.webref.injectJavaScript(`
        map.panTo([`+lat+`,`+long+`])
        `)
    }
    updateLocation(lat,long){
        this.webref.injectJavaScript(`
        locationMarker.setLatLng([`+lat+`,`+long+`])
        `)
    };
    markerCount = 0;
    addMarker(lat,long,icon,popup,infoLocation){
        this.markerCount++;
        this.webref.injectJavaScript(`
            var mkr`+this.markerCount+` = L.marker([`+lat+`,`+long+`],{icon:`+icon+`}).addTo(markerGroup)
        `)
        if(popup != null && popup != undefined && popup !=""){
            this.webref.injectJavaScript(`mkr`+this.markerCount+`.bindPopup();mkr`+this.markerCount+`.setPopupContent("`+popup+this._generateLink(infoLocation)+`")`)
        }
        return this.markerCount;// that way we can store the id of each marker
    }

    _generateLink(infoLocation){
        return " <a href='#' onclick='postMsg(`" + infoLocation + "`)'>More...</a>"
    }


    // Events
    initalised = false;
    _onWebviewMessage = (event)=>{
        this.props.onMapItemClick(event.nativeEvent.data);
    }


    // RENDER FUNCTION
    render() {
        return(
            <WebView
            ref={r => (this.webref = r)}
                source={{html:this.webviewHTML}}
                onMessage={this._onWebviewMessage}
            ></WebView> 
        )
    }
}

var goldImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAaQAAAGkBcaGY2AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK0SURBVEiJtZVLSJRhFIaf881o5lhq2AW7EGREkoaNQoQLJQJFTEhGu0AXCjcSRItcBVIERRBBESIWBobkrztBo0XhIoy0EFpUixYhSopO5qhJzpwWjnP5G62x6d395zvfc8534H+PsIJ0gFSEw0AeyhZAgVGUIXy8kFJ+LHdXYgL72YaTRuAEkLrMXR/KY/xcl4N8/SNY33Ae4R6wdqXXRBUQLoibp5FBY4PeQGiJAwqQhtKuAzTE7FgHOYfyKA6gXYpySopoD4H1HTvx8wFY8w9ggGmSyJH9jC2OIsC1BEAB1rHAVQDRftbjZBxITgAYwEc6WYYkyhIIBUjjOyUGZV8CoYtS8gyQnXCwkG1Q/AkHK34DjP4H8IjBMJRwsGFIdIBUYJzlzSZeTTLNZiOFzKK0JQgKykMpZWHxl35LNgE+Aa5/xE6QzG7Jx2sA5AAjKGdYNPLVKoBwVvLxQoRtShFdCA2rhPuBenHTvRSI8mNxc5uhnDvMOxf+Hmm+IVRIIU2RYfNbYm9BPk0VTl7vgbkVDG82BV7thQeVL8XNM/tx1GpSjycdGGPJlERh6wRsmgLXnKIi+FJgLANGN4AKgA+Xa6O0tkYtVmdUGdVyRMJOpwLDWTCc9R6RelTbgO225tKYmSkBepcfhTFVMR7dBxRLR0cfUAx8jJFz1B4IgbWuLgnVMtt5N1AmljUFIJb1BTgE9NvyqtQ21nDHXm8JkBH6FnlCZuYxsay5yAtiWZPAEeB5RDib6mp3bLBq5Bjuk5t7Wpqbf9qfGIT78Pkqgc5Q0OGIGmMYLFIRLHBLLOuiNDYGYkFD6T0988BxRFpiNBZc/9XVBRgziOpl6ey8uxLQLgWhpuYmqlcIBHZJV9fncMcORzmqJ+OFBjtT6ehoAC5hTGV0VY9nR7zAWNLa2tBi/gW199M0fAC2SAAAAABJRU5ErkJggg=="
