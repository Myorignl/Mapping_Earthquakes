// Add console.log to check to see if our code is working.
console.log("working");

// Create the tile layer that will be the background of the map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the satellite street view tile layer that will be an option for the map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the light view tile layer that will be an option for the map.
let navigationNight = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// Create a base layer that holds both/all 3 maps.
let baseMaps = {
	"Streets": streets,
	"Satellite": satelliteStreets,
	"Navigation Night": navigationNight
};

// Create the earthquake layer for the map.
let earthquakes = new L.LayerGroup();

// Create the earthquake layer for the map.
let tectonicPlates = new L.LayerGroup();

// adding Major Earthquake layer 
let majorEQ = new L.LayerGroup ();

// Define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates,
  "Major Earthquakes": majorEQ
};
// Pass map layers into layers control and add the layers control to the map.
// Add a control to the map to allow user to change which layers are visible
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
	//console.log(data);
	// This function returns the style data for each of the earthquakes plotted on
	// the map. Then pass the magnitude of the earthquake into two separate functions
	// to calculate the color and radius.
	function styleInfo(feature) {
	  return {
	    opacity: 1,
	    fillOpacity: 1,
	    fillColor: getColor(feature.properties.mag),
	    color: "#000000",
	    radius: getRadius(feature.properties.mag),
	    stroke: true,
	    weight: 0.5
	  };
	}
	// This function determines the color of the circle based on the magnitude of the earthquake.
	function getColor(magnitude) {
	  if (magnitude > 5) {
	    return "#ffff00";
	  }
	  if (magnitude > 4) {
	    return "#ff0000";
	  }
	  if (magnitude > 3) {
	    return "#dcdcdc";
	  }
	  if (magnitude > 2) {
	    return "#7fff00";
	  }
	  if (magnitude > 1) {
	    return "#0000ff";
	  }
	  return "#ff00ff";
	}
	// This function determines the radius of the earthquake marker based on its magnitude.
	// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
	function getRadius(magnitude) {
		if (magnitude === 0) {
			return 1;
		}
		return magnitude * 4;
	}
	// Creating a GeoJSON layer with the retrieved data.
	L.geoJson(data, {
		// Turn each feature into a circleMarker on the map.
		pointToLayer: function(feature, latlng) {
      console.log (data);
			return L.circleMarker(latlng);
		},
		// Set the style for each circleMarker using styleInfo function.
		style: styleInfo,
		// Create a popup for each circleMarker to display the magnitude and
	    // location of the earthquake after the marker has been created and styled.
		onEachFeature: function(feature, layer) {
			layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
		}
	}).addTo(earthquakes);

	// Add earthquake layer to map
	earthquakes.addTo(map);
});

// Create a legend control object.
let legend = L.control({position: "bottomright"});

// Then add all the details for the legend.
legend.onAdd = function() {
	let div = L.DomUtil.create("div", "info legend");
	const magnitudes = [0, 1, 2, 3, 4, 5];
	const colors = [
		"#ff00ff",
		"#0000ff",
		"#7fff00",
		"#dcdcdc",
		"#ff0000",
		"#ffff00"
	];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add legend to map
legend.addTo(map);

// Fault line data found on github
let tectonicPlatesData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

let myStyle = {
	color: "#ff0000",
	weight: 2
};

// Grab tectonic plate boundary GeoJSON data
d3.json(tectonicPlatesData).then(function(data) {
	console.log(data);

	// Create a GeoJSON layer with the retrieved data
	L.geoJson(data, {
		style: myStyle
	}).addTo(tectonicPlates);

	// Add tectnoic plates layer to map
	tectonicPlates.addTo(map);
	

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {
	// This function returns the style data for each of the earthquakes plotted on
	// the map. Then pass the magnitude of the earthquake into two separate functions
	// to calculate the color and radius.
	function styleInfo(feature) {
	  return {
	    opacity: 1,
	    fillOpacity: 1,
	    fillColor: getColor(feature.properties.mag),
	    color: "#ff7f50",
	    radius: getRadius(feature.properties.mag),
	    stroke: true,
	    weight: 0.5
	  };
	}

  // 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.

	// This function determines the color of the circle based on the magnitude of the earthquake.
	function getColor(magnitude) {
	  if (magnitude >6 ) {
	    return "#FF0000";
	  }
	  if (magnitude > 5) {
	    return "#800080";
	  }
	  if (magnitude <= 4) {
	    return "#ff7f50";
	  }
	  
  }
	// This function determines the radius of the earthquake marker based on its magnitude.
	// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
	function getRadius(magnitude) {
		if (magnitude === 0) {
			return 1;
		}
		return magnitude * 4;
	}
	// Creating a GeoJSON layer with the retrieved data.
	L.geoJson(data, {
		// Turn each feature into a circleMarker on the map.
		pointToLayer: function(feature, latlng) {
      console.log (data);
			return L.circleMarker(latlng);
		},
		// Set the style for each circleMarker using styleInfo function.
		style: styleInfo,
		// Create a popup for each circleMarker to display the magnitude and
	    // location of the earthquake after the marker has been created and styled.
		onEachFeature: function(feature, layer) {
			layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
		}
	}).addTo(majorEQ);

	// Add earthquake layer to map
	majorEQ.addTo(map);


// Create a legend control object.

map.on('overlayadd', function (eventLayer) {
    // Switch to the majorEQ legend...
    if (eventLayer.name === 'Major Earthquakes') {
        this.removeControl(Legend);
        majorEQlegend.addTo(this);
    } else { // Or switch to the legend...
        this.removeControl(Legend);
        majorEQlegend.addTo(this);
    }
});
var majorEQlegend = L.control({position: "bottomright"});

// Then add all the details for the legend.
majorEQlegend.onAdd = function() {
	var div = L.DomUtil.create("div", "info legend");
	const magnitudes = [4, 5, 6];
	const colors = [
		"#ff7f50",
		"#800080",
		"#FF0000"
	];
}
});
});