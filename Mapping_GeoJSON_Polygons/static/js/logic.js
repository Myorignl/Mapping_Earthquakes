console.log ("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//We create a tile layer that will be an option for our maps 
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//Create a base layer that holds both maps
let baseMaps = {
  "Street": streets,
  "Satellite Streets": satelliteStreets
};

// Create a base map object wixth center, zoom level and default layer. 
let map = L.map ("mapid", {
  center:[43.7, -79.3],
  zoom: 11,
  layers: [streets]
});

//Pass map layers into layer control and add layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Then we add our 'graymap' tile layer to the map.
//streets.addTo(map);

// Accessing the airport GeoJSON URL
let torontoHoods = "https://raw.githubusercontent.com/Myorignl/Mapping_Earthquakes/master/torontoNeighborhoods.json";

//style
let myStyle = {
  color: "#ff0000",
  weight: 1,
}
d3.json(torontoHoods).then(function(data) {
    console.log(data);
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJSON(data, {
      style: myStyle,
      onEachFeature: function(feature, layer){
            console.log(feature)
            layer.bindPopup("<h2> Neighborhood: " + feature.properties.AREA_NAME + "</h2>");
        }
    })
    .addTo(map);
    });
