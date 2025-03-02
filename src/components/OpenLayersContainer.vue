<script>
import "ol/ol.css"
import {Map,View} from "ol";
import TileLayer from "ol/layer/Tile";
import {OSM, XYZ} from "ol/source";
import {styleFunction} from '@/common/LayerStyle'
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {GeoJSON} from "ol/format";
import {easeOut} from "ol/easing"
import {Control} from "ol/control";
import ControlButton from "@/common/controls/ControlButton";
import BaseMapSelector from "@/common/controls/BaseMapSelector";

export default {
  name: 'OpenLayersContainer',
  props: ['geojson'],
  data: function() {
    return {
      baseLayer: Object,
      map: Object,
      mapId: Object
    }
  },
  methods: {
    download: function(map) {
      document.getElementById('export-png').addEventListener('click', function () {
        map.once('rendercomplete', function () {
          const mapCanvas = document.createElement('canvas');
          const size = map.getSize();
          mapCanvas.width = size[0];
          mapCanvas.height = size[1];
          const mapContext = mapCanvas.getContext('2d');
          Array.prototype.forEach.call(
              map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
              function (canvas) {
                if (canvas.width > 0) {
                  const opacity =
                      canvas.parentNode.style.opacity || canvas.style.opacity;
                  mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                  let matrix;
                  const transform = canvas.style.transform;
                  if (transform) {
                    // Get the transform parameters from the style's transform matrix
                    matrix = transform
                        .match(/^matrix\(([^\(]*)\)$/)[1]
                        .split(',')
                        .map(Number);
                  } else {
                    matrix = [
                      parseFloat(canvas.style.width) / canvas.width,
                      0,
                      0,
                      parseFloat(canvas.style.height) / canvas.height,
                      0,
                      0,
                    ];
                  }
                  // Apply the transform to the export map context
                  CanvasRenderingContext2D.prototype.setTransform.apply(
                      mapContext,
                      matrix,
                  );
                  const backgroundColor = canvas.parentNode.style.backgroundColor;
                  if (backgroundColor) {
                    mapContext.fillStyle = backgroundColor;
                    mapContext.fillRect(0, 0, canvas.width, canvas.height);
                  }
                  mapContext.drawImage(canvas, 0, 0);
                }
              },
          );
          mapContext.globalAlpha = 1;
          mapContext.setTransform(1, 0, 0, 1, 0, 0);
          const link = document.getElementById('image-download');
          link.href = mapCanvas.toDataURL();
          link.click();
        });
        map.renderSync();
      });
    },
    renderControl: function(items) {
      // items: [{label, url}]
      let element;
      items.forEach(item => {
        element += "<button class='map-control-item'>" + item.label + "</button>";
      });
      return new Control({
        element: element,
        target: 'map'
      });
    },
    updateBaseLayer: function(layer) {
      this.baseLayer = layer
    },
    getGeoJson() {
      return this.geojson;
    }
  },
  watch: {
    baseLayer: function(newValue, oldVal) {
      console.log("come from watch: ")
      console.log(newValue)
    },
    geojson: function(newGeojson, oldGeojson) {
      // clear all layers except baseLayer,and add new Geojson Layer
      let that = this;
      let layers = that.map.getLayers();
      layers.forEach(function(layer) {
        if (layer !== that.baseLayer) {
          that.map.removeLayer(layer)
        }
      });
      // render new layer
      let vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(newGeojson)
      });
      let vectorLayer = new VectorLayer({
        source: vectorSource,
        projection: 'EPSG:4326',
        style: styleFunction
      });
      that.map.addLayer(vectorLayer);
      //设置最佳视角
      let extend = vectorSource.getExtent();
      that.map.getView().fit(extend, {
        padding: [200, 200,200,200],
        duration: 2000,
        easing: easeOut,
      });
    }
  },
  mounted() {

    // init map start
     this.baseLayer = new TileLayer({
       source: new XYZ({
         url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
         crossOrigin: 'Anonymous'
       })
     });
     this.map = new Map({
      target: 'map',
      layers: [
        this.baseLayer
      ],
      controls: [],
      view: new View({
        projection: 'EPSG:4326',
        center: [120.30328, 31.57299],
        // center: [13195349,3725641],
        zoom: 12
      }),
    });
    this.map.addControl(new ControlButton(this.map, this.getGeoJson));
    this.map.addControl(new BaseMapSelector(this.map, this.updateBaseLayer));
    // init map end
    // init url reader start
    this.mapId = window.location.hash.substring(1);
    // init url reader end
  }
}
</script>

<template>
      <div id="map">
      </div>
</template>

<style scoped>
  .container {
    height: 100%;
    width: 100%;
  }
  #map {
    width: 100%;
    height: 98%;
  }
</style>