import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'
import {store} from './store/index';
import 'material-design-icons-iconfont';
import router from './router'

Vue.use(firestorePlugin);
Vue.use(vuetify);


Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
