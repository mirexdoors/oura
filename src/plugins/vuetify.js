import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import minifyTheme from 'minify-css-string';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#356859',
        secondary: '#fffbe6',
      }
    },
    options: {minifyTheme}
  },
});
