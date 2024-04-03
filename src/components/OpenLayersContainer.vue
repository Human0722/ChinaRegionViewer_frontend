<script>
import "ol/ol.css"
import {Map,View} from "ol";
import TileLayer from "ol/layer/Tile";
import {OSM, XYZ} from "ol/source";
import shp from 'shpjs'
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON"
import {styleFunction} from '@/common/LayerStyle'

export default {
  name: 'OpenLayersContainer',
  data: function() {
    return {
      map: Object
    }
  },
  methods: {
    handleFiles(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      const that = this;
      reader.onload = (e) => {
        const binaryString = e.target.result;
        console.log("add:" + binaryString)
        shp(binaryString).then(function(data){
          var vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(data)
          });
          var vectorLayer = new VectorLayer({
            source: vectorSource,
            style: styleFunction
          });
            that.map.addLayer(vectorLayer);
        })
      };
      reader.readAsDataURL(file);
    }
  },
  mounted() {

    // const geoJson = shp("./wuxi.zip").then(function(data) {
    //   console.log(data)
    // }).catch(e=>console.log('error', e))
    //  const vectorSource =  new VectorSource({
    //    features: new GeoJSON().readFeatures(geoJson)
    //  });
    //  const vectorLayer = new VectorLayer({
    //    source: vectorSource,
    //  });
     this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          })
        }),
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [120.30328, 31.57299],
        zoom: 12
      }),
    });

     console.log("mounted:" + this.map)
  }
}
</script>

<template>
    <div id="map">
      <input type="file" id="input" @change="handleFiles($event)">
    </div>
</template>

<style scoped>
  .container {
    height: 100%;
    width: 100%;
  }
  #map {
    width: 100%;
    height: 100%;
  }
</style>