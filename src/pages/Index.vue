<template lang="pug">
  div.row.justify-center
    
    
</template>

<script>

import { mapActions, mapGetters } from 'vuex'//

export default {
  name: 'PageIndex',
  components: {
  
    // globe
  },
  data () {
    return {
      address: '',
      vantaEffect: null,
      welcome1: ``,
      mp3: null
    }
  },
  beforeDestroy(){
    // this.mp3.stop()

  },
  beforeCreate(){
    // let home = this.$store.getters['host/get_home']
    // var numberOfEntries = window.history.length;
    
    // if (numberOfEntries == 0 && this.community)
    //   this.$router.push({name: "manifest", params: {community: this.community}})
    
    
  

  },
  mounted() {
    
  },
  computed:{
    
  },
  watch: {

  },
  methods: {
   
}
</script>
<style>

</style>