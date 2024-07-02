// API endpoint
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Get request to the URL
d3.json(queryUrl).then(function(data){

    let featureList = data.features
    let myMap = createMap(featureList)
});



//create the markers
function createMarkers(feature) {
    

    let long = feature.geometry.coordinates[0]
    let lat = feature.geometry.coordinates[1]
    let depth = feature.geometry.coordinates[2]
    let mag = feature.properties.mag

    let popUpText = `<h2>Location: ${feature.properties.place}</h2><ul><li> Magnitue: ${mag}</li><li>Depth: ${depth}</li></ul>`

    let markerLocation = [lat, long]

    let marker = L.circle(markerLocation, {
        fillOpacity: 0.75,
        color: "darkgreen",
        fillColor: getColor(depth),
        radius: mag * 5000
    }).bindPopup(popUpText);

    return marker
}

function getColor(depth) {
    let color = ""

    if(depth >= 90) {
        color = "red"
    } else if(depth < 90 && depth >= 70) {
        color = "orangered"
    } else if(depth < 70 && depth >= 50) {
        color = "orange"
    } else if(depth < 50 && depth >= 30) {
        color = "yellow"
    } else if (depth < 30 && depth >= 10) {
        color = "greenyellow"
    } else {
        color = "green"
    }

    return color;
}

function createMap(data) {
    let features = data;

    let featureMarkers = []

    features.forEach(element => {
        let marker = createMarkers(element);

        featureMarkers.push(marker)
    });

    let markerLayerGroup = L.layerGroup(featureMarkers)

    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	})

    let baseMaps = {
        "Street Map": streetMap
    }

    let overlayMaps = {
        "Earthquake Locations": markerLayerGroup
    }
    
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetMap]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap)

    return myMap
}


