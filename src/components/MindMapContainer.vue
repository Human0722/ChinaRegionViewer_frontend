<script>
import {Transformer} from "markmap-lib";
import {Markmap} from "markmap-view";
import axios from "@/common/Axios";
import MapMarkdownBuilder from "@/common/MapMarkdownBuilder";
import RootMarkdownBuilder from "@/common/RootMarkdownBuilder";

const transform = new Transformer();
const testContent = `#
- one
  - one.one
* two
  - two.two
    - two.two.two
- three
  - three.three
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
  watch: {
    '$route.hash': function(newHash, oldHash) {
      if (newHash.indexOf("province") !== -1) {
       //如果是省级别,就重新渲染所有市的信息
        let that = this;
        axios.get("/shape/index_city/" + newHash.substring(9))
            .then(response => {
              let markdown = MapMarkdownBuilder(response);
              that.markdownContent = markdown;
              console.log(that.markdownContent)
              that.update();
            });
      }else {
       //否则正常查询
        axios.get("/shape/" + newHash.substring(1))
            .then(response => {
              this.$emit('update-map', response);
            });
      }

    }
  },
  mounted() {
    this.markMapView = Markmap.create(this.$refs.refSvg,{initialExpandLevel: 2});
    this.markdownContent = testContent;
    this.update();

    // 查询所有省份的信息
    axios.get("/shape/index_province").then(response => {
      console.log(response)
      let markdown = RootMarkdownBuilder(response);
      this.markdownContent = markdown;
      this.update();
    })
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