<template>
    <v-overlay
            :absolute="absolute"
            :opacity="opacity"
            :value="overlay"
            :z-index="zIndex"
    >
        <v-layout row
                  wrap
                  align-center
                  justify-center
                  class="mx-auto my-auto" >
            <v-progress-circular
                    :size="140"
                    :width="15"
                    color="primary"
                    class="preloader"
                    indeterminate
            >
                <span class="subtitle-2">Waiting ...</span>
            </v-progress-circular>
        </v-layout>
    </v-overlay>
</template>

<script>
  export default {
    name: "preloader",

    data: () => ({
      absolute: true,
      opacity: 0.6,
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
