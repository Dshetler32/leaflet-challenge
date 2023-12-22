


const myMap = L.map('map').setView([0, 0], 2);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);


const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'; 

fetch(earthquakeURL)
    .then(response => response.json())
    .then(data => {
        
        data.features.forEach(feature => {
            const coords = feature.geometry.coordinates;
            const mag = feature.properties.mag;
            const depth = coords[2];

            
            const marker = L.circle([coords[1], coords[0]], {
                radius: mag * 50000, 
                color: 'red', 
                fillColor: getColor(depth), 
                fillOpacity: 0.7,
            }).addTo(myMap);

            
            marker.bindPopup(`<b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth}`);
        });
    });


const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (myMap) {
    
    const div = L.DomUtil.create('div', 'info legend');

    
    div.innerHTML = `<p><strong>Legend</strong></p>
                     <p style="background-color:${getColor(0)}">&lt; 10 km</p>
                     <p style="background-color:${getColor(30)}">10 - 30 km</p>
                     <p style="background-color:${getColor(50)}">30 - 50 km</p>
                     <p style="background-color:${getColor(70)}">50 - 70 km</p>
                     <p style="background-color:${getColor(90)}">70 - 90 km</p>
                     <p style="background-color:${getColor(100)}">&gt; 90 km</p>`;

    return div;
};

legend.addTo(myMap);


function getColor(depth) {
  
    return depth > 90 ? 'darkred' :
           depth > 70 ? 'red' :
           depth > 50 ? 'orange' :
           depth > 30 ? 'yellow' :
           depth > 10 ? 'lightgreen' :
                       'green';
}
