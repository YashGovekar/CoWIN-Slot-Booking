import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from "axios";
import { sha256 } from 'js-sha256';
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.sha256 = sha256;
Vue.prototype.appName = process.env.VUE_APP_NAME
Vue.prototype.apiURL = 'https://cdn-api.co-vin.in/api/v2'
Vue.prototype.kvDBUrl = 'https://kvdb.io/S5XhwfKG925hnnFndu6m9v';
Vue.prototype.secret = 'U2FsdGVkX1+z/4Nr9nta+2DrVJSv7KS6VoQUSQ1ZXYDx/CJUkWxFYG6P3iM/VW+6jLQ9RDQVzp/RcZ8kbT41xw==';

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
