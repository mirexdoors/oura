<template>
  <div>{{infoActivity}}</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      infoActivity: state => state.Active.infoActive
    })
  },
  created() {
    this.$store.dispatch("getActiveInfo");
  }
};
</script>