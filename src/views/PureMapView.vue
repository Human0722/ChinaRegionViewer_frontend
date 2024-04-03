<script>
import {Map, View} from 'ol'
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
export default {
  name: 'PureMapView',
  data: function() {
    return {
       map: Object
    }
  },
  mounted() {
    this.map = new Map({
      target: 'test',
      layers: [
          new TileLayer({
            source: new OSM()
          })
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [119.15859, 31.94521],
        zoom: 8
      })
    })
  }
}

</script>

<template>
  <div id="test"></div>
</template>

<style scoped>
#test {
  width: 100%;
  height: 100%;
}
</style>