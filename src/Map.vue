<template>
  <div id="map" class="map"></div>
</template>

<script>
import Map from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";

import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import Circle from "ol/geom/Circle";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { get as getProjection, fromLonLat, transform } from "ol/proj";

import "ol/ol.css";
import { eventBus } from "./main";

var image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({ color: "red", width: 1 })
});

var styles = {
  Point: new Style({
    image: image
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 3
    })
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 1
    })
  }),
  MultiPoint: new Style({
    image: image
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "yellow",
      width: 1
    }),
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.1)"
    })
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)"
    })
  }),
  GeometryCollection: new Style({
    stroke: new Stroke({
      color: "magenta",
      width: 2
    }),
    fill: new Fill({
      color: "magenta"
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta"
      })
    })
  }),
  Circle: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2
    }),
    fill: new Fill({
      color: "rgba(255,0,0,0.2)"
    })
  })
};

var styleFunction = function(feature) {
  return styles[feature.getGeometry().getType()];
};

export default {
  data() {
    return {
      zoom: 13,
      tallinnCenter: [24.7467042, 59.4373947], //center: [2754599, 8275684],
      tallinnCenterWGS: [2754628, 8275583],
      tallinnCenter3301: [542291, 6589070],
      rotation: 0,
      geoJson: [],
      geoJsonAsString: "",
      vectorSource: null,
      map: null
    };
  },
  mounted() {
    //Set our features on this vectorSource, so they can be loaded onto a vectorLayer
    this.vectorSource = new VectorSource({
      features: null
    });
    //Init vectorLayer where we will load our features onto
    var vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: styleFunction
    });

    //Initialize the main Map with OSM as baselayer and vectorLayer for features
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
            // projection: getProjection("EPSG:3301"),
            source: new OSM()
        //   source: new XYZ({
        //     url: "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart/{z}/{x}/{-y}.png?"
        //   })
        }),
        vectorLayer
      ],
      view: new View({
        //projection: getProjection("EPSG:4326"),
        center: this.tallinnCenter,// this.tallinnCenter3301, [59.4373947, 24.7467042], this.tallinnCenter,
        zoom: 8
      })
    });
  },
  created() {
    eventBus.$on("geoJsonFetched", geoJson => {
      this.geoJsonAsString = geoJson;
      console.log("geoJsonfetched in Map component", this.geoJsonAsString);

      var features = new GeoJSON({featureProjection: getProjection("EPSG:3857")}).readFeatures(this.geoJsonAsString);
      //Clear old features, true means no dispatching of removeFeature event, makes clearing faster
      this.vectorSource.clear(true);
      //Add new Features
      this.vectorSource.addFeatures(features);
    });
  }
};
</script>

<style scoped>
.map {
  height: 1300px;
}
</style> 
