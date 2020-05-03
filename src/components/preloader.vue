<template>
    <v-overlay
            :absolute="absolute"
            :opacity="opacity"
            :value="overlay"
            :z-index="zIndex"
    >
        <v-layout class="mx-auto my-auto" row wrap align-center justify-center>
            <v-progress-circular
                    :size="200"
                    :width="10"
                    color="primary"
                    class="preloader"
                    indeterminate
            ></v-progress-circular>
        </v-layout>
    </v-overlay>
</template>

<script>
  export default {
    name: "preloader",
    data: () => ({
      absolute: true,
      opacity: 0.46,
      overlay: true,
      zIndex: 9999,
    }),
  }
</script>
<style scoped>
    .preloader {
        top: 50%!important;
        transform: translateY(-50%)!important;
    }
</style>
