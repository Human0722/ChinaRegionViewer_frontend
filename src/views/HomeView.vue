<template>
  <div class="mainContainer" >
    <div class="mindmap" >
      <mind-map-container @update-map="updateMap"/>
    </div>
    <div class="openlayers" >
      <open-layers-container :geojson="geojson"/>
    </div>
  </div>
</template>

<script>
import MindMapContainer from "@/components/MindMapContainer.vue";
import OpenLayersContainer from "@/components/OpenLayersContainer.vue";
const markdownContent = `# Markmap
- type
- redis
`;

export default {

  name: 'HomeView',

  data: function() {
    return {
      geojson: String
    }
  },

  components: {
    MindMapContainer,
    OpenLayersContainer
  },

  methods: {
    updateMap(geojson) {
      this.geojson = geojson;
    }
  }
}
</script>
<style scoped>
  .mainContainer {
    height: 100%;
    width: 100%;

    display: flex;
  }
  .mindmap {
    width: 50%;
    height: 100%;

  }
  .openlayers {
    width: 50%;
    height: 100%;
  }
</style>

