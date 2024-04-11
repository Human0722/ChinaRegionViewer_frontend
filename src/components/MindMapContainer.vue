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
    '$route.hash': async function (newHash, oldHash) {
      if (newHash.indexOf("province") !== -1) {
        //如果是省级别,就重新渲染所有市的信息,并展示省地图
        let that = this;

        const r2 = await axios.get("/shape_reader/province_boundary/" + newHash.substring(9));
        const r1 = await axios.get("/shape/index_city/" + newHash.substring(9));
        let markdown = MapMarkdownBuilder(r1);
        that.markdownContent = markdown;
        that.update();
        that.$emit('update-map', r2);
      } else if(newHash ==="" || newHash === undefined) {
        window.location.href = '/'
      } else {
        // 否则正常查询
        axios.get("/shape/" + newHash.substring(1))
            .then(response => {
              this.$emit('update-map', response);
            });
      }

    }
  },
  async mounted() {
    this.markMapView = Markmap.create(this.$refs.refSvg, {initialExpandLevel: 2});
    this.markdownContent = testContent;
    this.update();

    let newHash = this.$route.hash;
    //如果hash 为空，则渲染全国省数据,并展示全国地图
    if (newHash === undefined || newHash === "") {
      axios.get("/shape/index_province").then(response => {
        let markdown = RootMarkdownBuilder(response);
        this.markdownContent = markdown;
        this.update();
      });
      axios.get("/shape_reader/nation_boundary").then(response => {
        this.$emit('update-map', response);
      });
    } else if (newHash.indexOf("province") !== -1) {
      //如果是省级别,就重新渲染所有市的信息
      let that = this;
      const r2 = await axios.get("/shape_reader/province_boundary/" + newHash.substring(9));
      const r1 = await axios.get("/shape/index_city/" + newHash.substring(9));
      let markdown = MapMarkdownBuilder(r1);
      that.markdownContent = markdown;
      that.update();
      that.$emit('update-map', r2);
    } else {
      //否则重定向到国家级
      window.location.href = '/';
    }

    // 查询所有省份的信息
    // axios.get("/shape/index_province").then(response => {
    //   console.log(response)
    //   let markdown = RootMarkdownBuilder(response);
    //   this.markdownContent = markdown;
    //   this.update();
    // })
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