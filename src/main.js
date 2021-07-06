import Vue from 'vue'
import App from './App.vue'


Vue.config.productionTip = false;

//引入cesium相关文件
const cesium = require('cesium/Cesium');
const widgets= require('cesium/Widgets/widgets.css');

Vue.prototype.cesium = cesium
Vue.prototype.widgets = widgets
// window.cesium = cesium;


new Vue({
  render: h => h(App),
}).$mount('#app')
