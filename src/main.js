import Vue from 'vue'
import App from './App'
import VueLogger from 'vuejs-logger';
import Notifications from 'vue-notification'
import VueLoading from 'vuejs-loading-plugin'

Vue.config.productionTip = false

const options = {
  isEnabled: true,
  logLevel : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : false,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueLogger, options);
Vue.use(Notifications);
Vue.use(VueLoading);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});