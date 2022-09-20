// We create the tile layer that will be the background of our map.
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//We create a tile layer that will be an option for our maps 
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//Create a base layer that holds both maps
let baseMaps = {
  Light: light,
  Dark: dark
};

// Create a base map object wixth center, zoom level and default layer. 
let map = L.map ("mapid", {
  center:[30, 30],
  zoom: 2,
  layers: [light]
});

//Pass map layers into layer control and add layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Then we add our 'graymap' tile layer to the map.
//streets.addTo(map);

//// Accessing the airport GeoJSON URL
let torontoData = "https://raw.githubusercontent.com/Myorignl/Mapping_Earthquakes/main/torontoRoutes.json";

//let airportMarker = new L.LayerGroup();
// Grabbing out GeoJSON data.
let myStyle = {
  color: "#ffff00",
  weight: 2,
}
d3.json(torontoData).then(function(data) {
    console.log(data);
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJSON(data, {
      style: myStyle,
      onEachFeature: function(feature, layer){
            console.log(feature)
            layer.bindPopup("<h2> Airline: " + feature.properties.airline + "</h2><hr><h2> Destination: " + feature.properties.dst + "</h2>");
        }
    })
    .addTo(map);
    });
