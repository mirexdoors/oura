import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'
import {store} from './store/index';
import 'material-design-icons-iconfont';

Vue.use(firestorePlugin);


Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
