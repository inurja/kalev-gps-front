import Vue from 'vue'
import App from './App.vue'
import UiMap from './Map.vue'
import GpsDataRequestForm from './GpsDataRequestForm.vue'
import VueLayers from 'vuelayers'
import VueResource from 'vue-resource'
import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(VueResource);
Vue.use(VueLayers);

Vue.component('gps-data-request-form', GpsDataRequestForm)
Vue.component('map-component', UiMap)

export const eventBus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
})
