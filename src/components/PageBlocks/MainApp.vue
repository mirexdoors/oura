<template>
   <div>
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
