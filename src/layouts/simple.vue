<template lang="pug">
  q-layout(view="hHh LpR lFr")    
    q-page-container.text-white
      explorer


  
</template>

<script>//
import explorer from '@/components/Explorer/index.vue'


export default {
  data () {
    return {
      left: false,
      right: false
    }
  },
  created(){
  },
  methods: {
    refresh(){

      
    }
  },

  components: {
    explorer
  }
}
</script>
