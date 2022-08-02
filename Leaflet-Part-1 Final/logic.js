 
  // Define a function that the circle size is based on the magnitude of the earthquake
  function circleSize(feature){
    radius = feature.properties.mag
    return radius*7;
  }
  
  // Define a function to show the color change by the depth of earthquake 
  function circleColor(feature){
    depth = feature.geometry.coordinates[2]
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
  
  //Define function to customerize circle size and color 
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.1,
      fillColor: circleColor(feature),
      color: "#000000",
      radius: circleSize(feature),
      stroke: true,
      weight: 0.5
    };
  }

 // Define streetmap and darkmap layers
 var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
  
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]  
    });

// Add streetmap tile to map; if only one tile defined then this is a good way of doing this.
// If only one tile layer then the following will be used "L.control.layers(null, overlayMaps, " later in the code
streetmap.addTo(myMap);
// if multiple tiles are being used then the above code is not needed.  The multiple tiles will be added
// when "L.control.layers(baseMaps, overlayMaps, " 


// create layer; will attach data later on
var earthquakes = new L.LayerGroup();


// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create a layer control
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // console.log(data)

  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    style: styleInfo,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(earthquakes);

  // Here are some additional examples:  https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/ 

  earthquakes.addTo(myMap);

  //create legend 
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function() {
    // code for legend
    var div = L.DomUtil.create ('div', 'legend')
  

    //define seperation of color
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // for loop to render color schema
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += `<i style='background:${colors[i]}'></i> 
          ${grades[i]} ${grades[i + 1] ? `&ndash; ${grades[i + 1]} <br>` : "+"}`;
    }  
    return div;
  };

legend.addTo(myMap);

});


