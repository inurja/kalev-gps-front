<template>
  <div>
    <div class="form-group">
      <label>
        <b>Server URL:</b>
      </label>
      <input class="form-control" type="text" v-model="serverUrl" />
    </div>
    <div class="form-group">
      <select v-model="selected">
        <option v-for="option in options" v-bind:value="option.value">
            {{ option.text }}
        </option>
      </select>
    </div>
    <button @click="getGpsData">Get GPS data</button>
  </div>
</template>

<<script>
import { eventBus } from './main';

export default {
    data: function() {
        return {
            serverUrl: 'http://localhost:8080',
            featureType: 'point',
            selected: 'point',
            options: [
                { text: 'Point', value: 'point' },
                { text: 'LineString', value: 'lineString' }
            ],
            geoJson: [],
            geoJsonAsString: ''
        }
    },
    methods: {
        getGpsData() {
            this.$http.get(this.serverUrl + "/rest/v1/gps/getGeoJson/?" + this.selected + "=true")
            .then(response => {
                this.geoJsonAsString = response.bodyText
                return response.json();
            })
            .then(data => {
                this.geoJson = data
                eventBus.$emit('geoJsonFetched', this.geoJsonAsString)
            });
        }
    },
    created() {

    }
}
</script>

<style>
</style>