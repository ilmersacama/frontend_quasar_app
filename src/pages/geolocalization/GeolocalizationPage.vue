<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Ubicación de la Empresa</div>
      </q-card-section>
      <div id="map"></div>
    </q-card>
    <!-- <l-map ref="map" v-model:zoom="zoom" :center="[47.41322, -1.219482]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  name: "GeolocalizationPage",
  setup() {
    let myMap;

    onMounted(() => {
      var myMap = L.map("map").setView([-16.54445, -68.085], 15);
      var marker = L.marker([-16.54445, -68.085]).addTo(myMap);
      marker.bindPopup("<b>ATT!</b><br>Direccion.").openPopup();
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 18,
        maxZoomDelta: 0,
        tileSize: 256,
        zoomOffset: 0,
        maxZoomMinZoom: 18,
      }).addTo(myMap);
    });
    //apunta a la direccion actual donde nos encontramos
    // navigator.geolocation.getCurrentPosition(
    //     (pos) => {
    //       const { coords } = pos;
    //       const { latitude, longitude } = coords;
    //       console.log(coords.latitude, longitude);
    //       L.marker([latitude, longitude]).addTo(myMap);

    //       setTimeout(() => {
    //         myMap.panTo(new L.LatLng(latitude, longitude));
    //       }, 5000);
    //     },
    //     (err) => {
    //       console.log(err);
    //     },
    //     {
    //       enableHighAccuracy: true,
    //       timeout: 5000,
    //       maximumAge: 0,
    //     }
    //   );
    //agregar icono en el mapa
    // let iconMarker = L.icon({
    //     iconUrl: 'marker.png',
    //     iconSize: [60, 60],
    //     iconAnchor: [30, 60]
    // })
    // let marker2 = L.marker([51.51, -0.09], { icon: iconMarker }).addTo(myMap)
    // para agregar puntos en el mapa
    // myMap.doubleClickZoom.disable();
    // myMap.on("dblclick", (e) => {
    //   let latLgn = myMap.mouseEventToLatLng(e.originalEvent);
    //   L.marker([latLgn.lat, latLgn.lon]).addTo(myMap);
    // });

    return {
      myMap,
    };
  },
});
</script>
<style scoped>
#map {
  width: 100%;
  height: calc(100vh - 150px);
}
</style>
