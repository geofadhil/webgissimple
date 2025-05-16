// Inisialisasi posisi awal (home)
const home = { lat: -6.903, lng: 107.6510, zoom: 13 };

// Inisialisasi peta
const map = L.map('map', {
  fullscreenControl: true
}).setView([home.lat, home.lng], home.zoom);

// Basemap OSM
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Basemap Google (tidak langsung ditampilkan)
const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

//Basemaps Google satelit
const baseMapGoogleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map data © Google',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Basemap control
const baseMaps = {
  "OpenStreetMap": basemapOSM,
  "Google Maps": baseMapGoogle,
  "Google Satellite": baseMapGoogleSatellite  // ✅ ini tambahan
};


// Tombol "Home"
const homeControl = L.control({ position: 'topleft' });
homeControl.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = '🏠';
  div.style.backgroundColor = 'white';
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.lineHeight = '30px';
  div.style.textAlign = 'center';
  div.style.cursor = 'pointer';
  div.title = 'Kembali ke Home';
  div.onclick = function() {
    map.setView([home.lat, home.lng], home.zoom);
  };
  return div;
};
homeControl.addTo(map);

// Fitur "My Location"
L.control.locate({
  position: 'topleft',
  flyTo: true,
  strings: {
    title: "Temukan lokasiku"
  },
  locateOptions: {
    enableHighAccuracy: true
  }
}).addTo(map);

//menambahkan data spasial
//menyiapkan simbologi jembatan
var symbologyPoint = { 
  radius: 5, 
  fillColor: "#9dfc03", 
  color: "#000", 
  weight: 1, 
  opacity: 1, 
  fillOpacity: 0.8 
} 

//memanggil data
//poin jembatan
const jembatanPT = new L.LayerGroup(); 
$.getJSON("./asset/data-spasial/jembatan_pt.geojson", function (OBJECTID) { 
    L.geoJSON(OBJECTID, { 
            pointToLayer: function (feature, latlng) { 
            return L.circleMarker(latlng, symbologyPoint);} 
        }).addTo(jembatanPT); 
    }); 
jembatanPT.addTo(map); 

//admin line Kota Bandung
const adminKelurahanAR = new L.LayerGroup(); 
$.getJSON("./asset/data-spasial/admin_kelurahan_ln.geojson", function (OBJECTID) { 
          L.geoJSON(OBJECTID, { 
          style: { 
          color : "black", 
          weight : 2, 
          opacity : 1, 
          dashArray: '3,3,20,3,20,3,20,3,20,3,20', 
          lineJoin: 'round' 
} 
}).addTo(adminKelurahanAR); 
}); 
adminKelurahanAR.addTo(map); 

//penggunaan lahan

const landcover = new L.LayerGroup(); 
$.getJSON("./asset/data-spasial/landcover_ar.geojson", function (REMARK) { 
L.geoJson(REMARK, { 
style: function(feature) { 
switch (feature.properties.REMARK) { 
case 'Danau/Situ': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Empang':   return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Hutan Rimba': return {fillColor:"#38A800", fillOpacity: 0.8, color: 
"#38A800"}; 
case 'Perkebunan/Kebun':   
return {fillColor:"#E9FFBE", fillOpacity: 0.8, 
color: "#E9FFBE"}; 
case 'Permukiman dan Tempat Kegiatan': return {fillColor:"#FFBEBE", 
fillOpacity: 0.8, weight: 0.5, color: "#FB0101"}; 
case 'Sawah':   return {fillColor:"#01FBBB", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Semak Belukar': return {fillColor:"#FDFDFD", fillOpacity: 0.8, 
weight: 0.5, color: "#00A52F"}; 
case 'Sungai':   return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 
0.5, color: "#4065EB"}; 
case 'Tanah Kosong/Gundul': return {fillColor:"#FDFDFD", fillOpacity: 0.8, 
weight: 0.5, color: "#000000"}; 
case 'Tegalan/Ladang':   return {fillColor:"#EDFF85", fillOpacity: 0.8, 
color: "#EDFF85"}; 
case 'Vegetasi Non Budidaya Lainnya':   return {fillColor:"#000000", 
fillOpacity: 0.8, weight: 0.5, color: "#000000"}; 
} 
}, 
onEachFeature: function (feature, layer) { 
layer.bindPopup('<b>Tutupan Lahan: </b>'+ feature.properties.REMARK) 
} 
}).addTo(landcover); 
}); 
landcover.addTo(map); 
// Overlay layer control
const overlayMaps = {
  "Jembatan PT": jembatanPT,
  "Admin Kelurahan": adminKelurahanAR,
  "Landcover": landcover,
};
// Buat kontrol legenda
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h4>Legenda Landcover</h4>";

  const categories = [
    { label: "Hutan", color: "green" },
    { label: "Permukiman", color: "red" },
    { label: "Sawah", color: "yellow" },
    { label: "Perkebunan", color: "orange" },
    { label: "Air", color: "blue" }
  ];

  categories.forEach(item => {
    div.innerHTML +=
      `<i style="background:${item.color}; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ${item.label}<br>`;
  });

  return div;
};

// Tambahkan ke peta
legend.addTo(map);

// Control panel di pojok kanan atas
L.control.layers(baseMaps, overlayMaps, { position: 'topright', collapsed: false }).addTo(map);