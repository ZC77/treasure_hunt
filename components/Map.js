import * as React from 'react';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { View, Text } from 'react-native';
import { ProgressBarAndroid } from 'react-native';
// here all the map code can go for talking to the webview
// https://leafletjs.com/examples/quick-start/
// https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#react-native-webview-guide

export default class Map extends React.Component {
    
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
    <div id="mapid">
            <div class="leaflet-top leaflet-right" style="margin:10px;pointer-events:auto;">
                <button onclick="console.log('hi');map.panTo(locationMarker.getLatLng())" class="leaflet-bar" style="font-size:x-large;color:dodgerblue;background-color:#FFF">⦿</button>
            </div>    
    </div>
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
// icons
icon_gold = L.icon({
    iconUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAaQAAAGkBcaGY2AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK0SURBVEiJtZVLSJRhFIaf881o5lhq2AW7EGREkoaNQoQLJQJFTEhGu0AXCjcSRItcBVIERRBBESIWBobkrztBo0XhIoy0EFpUixYhSopO5qhJzpwWjnP5G62x6d395zvfc8534H+PsIJ0gFSEw0AeyhZAgVGUIXy8kFJ+LHdXYgL72YaTRuAEkLrMXR/KY/xcl4N8/SNY33Ae4R6wdqXXRBUQLoibp5FBY4PeQGiJAwqQhtKuAzTE7FgHOYfyKA6gXYpySopoD4H1HTvx8wFY8w9ggGmSyJH9jC2OIsC1BEAB1rHAVQDRftbjZBxITgAYwEc6WYYkyhIIBUjjOyUGZV8CoYtS8gyQnXCwkG1Q/AkHK34DjP4H8IjBMJRwsGFIdIBUYJzlzSZeTTLNZiOFzKK0JQgKykMpZWHxl35LNgE+Aa5/xE6QzG7Jx2sA5AAjKGdYNPLVKoBwVvLxQoRtShFdCA2rhPuBenHTvRSI8mNxc5uhnDvMOxf+Hmm+IVRIIU2RYfNbYm9BPk0VTl7vgbkVDG82BV7thQeVL8XNM/tx1GpSjycdGGPJlERh6wRsmgLXnKIi+FJgLANGN4AKgA+Xa6O0tkYtVmdUGdVyRMJOpwLDWTCc9R6RelTbgO225tKYmSkBepcfhTFVMR7dBxRLR0cfUAx8jJFz1B4IgbWuLgnVMtt5N1AmljUFIJb1BTgE9NvyqtQ21nDHXm8JkBH6FnlCZuYxsay5yAtiWZPAEeB5RDib6mp3bLBq5Bjuk5t7Wpqbf9qfGIT78Pkqgc5Q0OGIGmMYLFIRLHBLLOuiNDYGYkFD6T0988BxRFpiNBZc/9XVBRgziOpl6ey8uxLQLgWhpuYmqlcIBHZJV9fncMcORzmqJ+OFBjtT6ehoAC5hTGV0VY9nR7zAWNLa2tBi/gW199M0fAC2SAAAAABJRU5ErkJggg==",
    iconAnchor: [11, 15],
}) 
icon_bronze = L.icon({
    iconUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAACXBIWXMAAABoAAAAaAGj5no8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAtZJREFUSImtlU9IVFEUxn/nzmiORY6FBUYuShemsyh34aKNoIUFycxUREQLCyqIFgURUWDQn0VFQWBRQUn0ni6iwiAiclOLhCSnCEKioMg0/zTiWM47LdRxZnpa1vt293v3/s53D++dJ8yiF/fIDySocZRKlKXGoCifgZe5C3hStp6xmc6KmxmzKFE4IRBVCMxw9rsI18eUpjURvv4R/OoOe0Q4B+TNdps0DaPsqozSlm6ajKQ2Z0W4PAcowEIEO2Zx0DVxzGKfwsU5ALOlqmwJRbFS4JhFqcJrIOc/wACDPj+l5Zvpn2pFkwdQgGBynCMAErNYpPAF8HsABhhMDLDEOMp6D6EAwbwg1UYMlR5CAVAIGVGKvQaLodgoJD0HQ9LoxLfvqdThk0Ho8hosQpcx8ABmnlL/oN4YPDMVEeLAba+oAlciEZIGQJMcExj1gNub+4MzMDndQlv56MDu/yEKJEXYWbad4RQYIBThpsJRQP+BO+4ojRVh2qeMjHkcinAy2LPigm/c/9fvtjjmmwi1oSjX0v3fZsSyzqqKZHfI97X8DYMl70nO++EK9I/mUdizgsXvyp76W+4+/q1g+kLD4QKgF8gFUFFGF/eRKBhiPJBQVCQnESBvMEigv3DqeJz584vkxo3EzIlV6xDJTVVVIb+viPy+om5E9qJ6C1ieFW4BIyPrgIfpZkaPMWaTy607gGqxrA6gGnjrsmdjtpECa2NjDqq1Wc/vA7Vi20MAYtsfgLXA86x9mzSrrdOJBwbWAcHUWqSFwsLNYtsZH47Y9jegBniUZhfT0FDlDlZNb8MlVq3aIc3NP7OvOAmPE4/XA60p0+fLaOM0WGTDZIHTYtv75fhxxw2a2t7ePgZsQeSqS7CJvmhDw2qM6UT1oLS2np8NmC0FIRI5heohHGeltLX1TCf2+epQ3TZX6GQyFcs6DBzAmPrMquFwyVyBbtJoNPVj/gWPTOk5xcRtRwAAAABJRU5ErkJggg==",
    iconAnchor: [11, 15],
})
icon_silver = L.icon({
    iconUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAACXBIWXMAAABoAAAAaAGj5no8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAvNJREFUSIm1lU1oXFUUx3/nTjNJOiG2YiyE2o3NplMXJrwkhCy6CaRKLTTMpLgQcREFW5AuFESkhRZqu1BREKpoqYowL8GNEtGF0EUU8lISEMFNFg6YdqQf1hdqO3nz7yLJZOY5iY59/pfnnvs7H9x7jrGFgiDYLmkE2G9muwABS2Y239nZ+X1PT8/dze7aJsA9wClgHGjf5O6fwCfOudO9vb2//yM4CIKXgLeBtq2qqdFtSS94njdVa3Qx6HnggyagAJ1m5gdBcKJhxrOzs8fM7L0mgHHJzI729fUVquC5ubm9kn4GWh4ADHAriqK9AwMD1x1ApVI5nQAUYEcqlXodwGZmZh5Op9PXgG0JgAFuAY+61tbWpxKEAuwAhp2k/QlC1/WEM7Pu/wHc7SRFSVMlRQ5YShrsnPvNmdlC0mBJC66tre1rYNMp9R9UWlxc/MFls9kQ+CIpqpl9mM/no/Wf9yZwJwFuqVwun4O16dbf31+U9OIDQiNJzw8ODt6uggE8z/tU0husbolmtSJpwvO86XVD3Tz2PO9M18LCu+7evX/9tl0U3XDOjXqe93Gt/W8bRLnctyvt7SNXh4a4ns2y0t54M7WEIY/Mz7PrypUvt126dCR+XgdWLvcQUALSADJjefdu7nR1Uc5khGQtYcj2UonM0hJIACGZTJddvPhXLat+qkkHMUtXo0p0FIt0FIs/YfYy0mfAY7HkOlhePgB8U9eiOhfnDjeo+jIwbIXCZWAY+KWBzzNxQxWsiYkWpNHY+VfAqPn+HwDm+78CQ8CPMb/DirV1I+ObNw+wOqRXZfY5O3ceMd+v+zjm+zeAEeC7GnM3Y2N9jcFSbRveZ9++5+zChXK8xDV4SBgeAiarxlSqro0bYLOn1wK8Zb5/3E6erDSCVt2np+8CRzH7qEFiq33R2NiTODeHdMImJ9/ZChiXwMjnzyK9SqXyuE1NLW5knEodRHq2WehaZrJC4TXgFZw7VB81l9vTLLCRND5eXcz3AW/2BOhM6AzCAAAAAElFTkSuQmCC",
    iconAnchor: [11, 15],
})
icon_qmark = L.icon({
    iconUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAACXBIWXMAAABoAAAAaAGj5no8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAmdJREFUSIm11k1oVFcYxvHfnUiaogsDFaRSpSoWRHBXixSa6EJQQRTsonYhgVq1xY0LUYpzJoXQjUFoY0R0oZCigisXrgqDxbYqYlYtVEGFWm2zEELiR3DmdjEz9mScOx+1vrv3Oef83+d83Xt4TZE0b/76XcprsZR0LskT0glyNynfIMx0CC5sIP0KHzapOonvcYRwuwU4dGMUA81nMiuekgyS/wZpTcxF0BwuRNBSxVGyjp751fYlJJ/icgTuIR0inIiNRo4Le0iPVZN75LZz+Hq20cIO0uOYF4mfEU7WOU6/jDrcId1IoT8bnB8j+bhODNWZ1RwPv8nktMabOUrYm10g/II1/+a5Dzh8ter4WU8GFPYQlmeD3Zmdpot5sRQHH+HnjIElTGW4zeH9OvB0BAafmL3b8AS7CQ8ziu7D0iifwk80nP7gasrvkSSkPxL+bMwsbCE9hzcicT9hOAPcToTd+BZzIvEUdhHK/wEc3sIJbI3EFEdwoAbtEBy2YQQLI/Fvkp3kL9X3bgM8tICZEWyvazhL9z4OTTQa1QI8+BHlMSyKxL9IviB/odnIXHZT4XPKP9RBz2BlKyiZjsOAyi7X4jHJrsr3ob1oAD7fxa8T6K0K97GZMN4ulIZL8fvCCAqnO4VmgJ8/wL1I6OsUCl0vS8WUviK2YS7eoW8OxeIrgqH4kPUXq1+qK5V+/b0Uf+vI9uuIVu+KZZQOYgXu4jvCtVcEh7cxjgWRWCLZSv5iK3CTm5dsqoNCF+mOVtAW4PSW6AESFbzSDjjjVEDxLv1/YJXKhXmKoxiqHMn/JcI8Hf4U/gFyMJqhhws8AgAAAABJRU5ErkJggg==",
    iconAnchor: [11, 15],
})
icon_emark = L.icon({
    iconUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAACXBIWXMAAABoAAAAaAGj5no8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAIVJREFUSIljYKARYCSspGEpAwMDK5LAXwaGhkhCuliIsDyYgYGBHYn/mwg9DEzEKCIHjBo8avCowYPV4G9o/K/UMvgtGv/dkDMYnU81gwc2KIipQa4yMDCcReJfI8bgUUB7QEy74hgDAwMbksAfBoYGC0K6iEkVRgyj7QpKABFhzC5JjsEAbFgWjXhL2dUAAAAASUVORK5CYII=",
    iconAnchor: [11, 15],
})
icon_location = L.icon({
    iconUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAACXBIWXMAAABoAAAAaAGj5no8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAQlJREFUSInt1LEuBFEYhuHnzEYhREHBFehQkjWynUIjLsAtKDRKjQuQbKNwHaJE7Eah1JEQlUSxhWJDdmcUq9qZ3ZlVKGTe8v/+856vODlUVFT8PaFw4yZdFdnGIjoiV+qh/XtxO52XOMdeTtrSt68RnicT36Vzem6xMqbUG9bF4TUvjHKP9JwUSGEJZ6PCbON2Oi3xjpkC8YC+ZY3wODzONk6slZYODBv542FSs6WlA0PuflZc8zKROJH7MrLienjCQ0ltR811OfGAI6SF2uBYPXTLi+NwgUMkY7RNm6E5KhzVmDicimzhEl8/0wQt7IrDwZhLS/wVcJ9O+bCgq2MnfJY6U1HxD/gGtcQ1xF0jExIAAAAASUVORK5CYII=",
    iconAnchor: [11, 15],
})
// create marker group
var markerGroup = L.layerGroup()
markerGroup.addTo(map)
// create location marker
var locationMarker = L.marker([-37.780, 175.315],{icon:icon_location}).addTo(map)
// message posting
function postMsg(message){
    window.ReactNativeWebView.postMessage(message);
}

</script>
</html>
    `;
    //--------------------------------PRIVATE METHODS --------------------------------

    componentDidMount(){
        this.componentDidUpdate();
    }
    componentDidUpdate(){
        Location.requestPermissionsAsync()
        .then(
            status => Location.getCurrentPositionAsync({})
        ).then(location=>{
            // update map marker location
            this.webref.injectJavaScript(`
            locationMarker.setLatLng([`+location.coords.latitude+`,`+location.coords.longitude+`])
            `)
            // call onlocationupdate
            this.props.onLocationUpdate(location.latitude,location.longitude)
        }).catch(err=>{
            this.props.onLocationError(err)
        })
    }
    


    _generateLink(infoLocation){
        return " <a href='#' onclick='postMsg(`" + infoLocation + "`)'>More...</a>"
    }


    // Events
    loaded = false;
    _onWebviewMessage = (event)=>{
        if(event.nativeEvent.data == "load"){
            if(!this.loaded){this.props.onLoad();this.loaded = true;}
            return;
        }
        this.props.onMarkerClick(event.nativeEvent.data);
    }
    
    // get location



    ///------------------------------PUBLICLY ACCESSIBLE METHODS -----------------------
    //---------STATIC METHODS/CONSTANTS
    static icons = {
        gold:"icon_gold",
        silver:"icon_silver",
        bronze:"icon_bronze",
        qMark:"icon_qmark",
        eMark:"icon_emark",
        default:"L.Icon.Default"
    }

    static distanceBetween(lat1, lng1, lat2, lng2){
        var earthRadiusM = 6378100;
        var dLat = (lat2-lat1)* (Math.PI/180);
        var dLng = (lng2-lng1)* (Math.PI/180);

        lat1 = (lat1)* (Math.PI/180);
        lat2 = (lat2)* (Math.PI/180);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return earthRadiusM * c;
    }

    // -----------MAP MODIFIER METHODS 
    panTo(lat , long){
        this.webref.injectJavaScript(`
        map.panTo([`+lat+`,`+long+`])
        `)
    }

    markerCount = 0;
    addMarker(lat,long,icon,popupMsg){
        this.markerCount++;
        this.webref.injectJavaScript(`
            var mkr`+this.markerCount+` = L.marker([`+lat+`,`+long+`],{icon:`+icon+`}).addTo(markerGroup)
        `)
        if(popupMsg != null && popupMsg != undefined && popupMsg !=""){
            this.webref.injectJavaScript(`
                mkr`+this.markerCount+`.bindPopup();
                mkr`+this.markerCount+`.setPopupContent("`+popupMsg+this._generateLink(this.markerCount)+`")
            `)
        }
        return this.markerCount.toString();// that way we can store the id of each marker
    }
    removeMarker(marker){
        this.webref.injectJavaScript("markerGroup.removeLayer(mkr"+marker+")");
    }
    changeMarkerIcon(marker,newIcon){
        this.webref.injectJavaScript("mkr"+marker+".setIcon("+newIcon+")");
    }
    changeMarkerPopup(marker,popupMsg){
        this.webref.injectJavaScript(` mkr`+marker+`.setPopupContent("`+popupMsg+this._generateLink(marker)+`")`);
    }

    /*
    Props/events:
    onLoad: function that runs when the map loads
    onLocationUpdate(lat,long): function that runs when the location is updated
    onLocationError(errorMsg)
    onMarkerClick(markerID)
    */
    
    // ------------------------------- RENDER FUNCTION ----------------------------------
    render() {
        return(
            <WebView
            ref={r => (this.webref = r)}
                source={{html:this.webviewHTML}}
                onMessage={this._onWebviewMessage}
                injectedJavaScript={"postMsg('load')"}
            ></WebView> 
        )
    }
}
