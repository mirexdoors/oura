<template>
   <div>
       <v-card-title class="text-center justify-center py-12">
           <h1 class="font-weight-bold display-3 primary--text text-break px-2">
               Health Board
           </h1>
       </v-card-title>
       <Tabs/>
       <Data/>
   </div>
</template>

<script>
    import Data from "../main/Data";
    import Tabs from "../Tabs";

    export default {
        name: "MainApp",

        components: {
            Data,
            Tabs,
        },
    };
</script>
