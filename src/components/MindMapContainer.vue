<script>
import {Transformer} from "markmap-lib";
import {Markmap} from "markmap-view";
const transform = new Transformer();
const testContent = `# markmap
- one
- two
- three
`;

export default {
  name: "MindMapContainer",
  data: function() {
    return {
      markdownContent: String,
      markMapView: Object
    }
  },
  methods: {
    update() {
      let {root} = transform.transform(this.markdownContent);
      this.markMapView.setData(root);
      this.markMapView.fit();
    }
  },
  mounted() {
    this.markMapView = Markmap.create(this.$refs.refSvg);
    this.markdownContent = testContent;
    this.update();
  }
}
</script>

<template>
  <div class="container">
    <svg ref="refSvg"></svg>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
}
svg {
  height: 100%;
  width: 100%;
}


</style>