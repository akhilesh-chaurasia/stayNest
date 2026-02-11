const lng = coordinates[0];
const lat = coordinates[1];

const map = L.map("map").setView([lat, lng], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.marker([lat, lng], { icon: redIcon })
  .addTo(map)
  .bindPopup(`<b>${title}</b><br>Exact location provided after booking`)
  .openPopup();
