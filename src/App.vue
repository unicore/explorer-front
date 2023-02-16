<template lang="pug">
  div(id="q-app" style="overflow: hidden; ")
    router-view

</template>

<script>//
import { mapActions } from 'vuex'//
import config from '@/config/index'
import { Cookies } from 'quasar'


export default {
  meta() {
    return {
        // sets document title
      title: this.$route.name,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title.toUpperCase()} - ${this.$store.state.host.host_obj.username}`,

      // meta tags
      meta: {
        description: { name: 'description', content: this.hosts[0].title + this.hosts[0].purpose},
        keywords: { name: 'keywords', content: 'community' },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
        // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
        ogTitle:  { 
          name: 'og:title', 
          // optional; similar to titleTemplate, but allows templating with other meta properties
          template (ogTitle) {  
            return `${ogTitle} - `
          }
        }
      },
    }
  },
  name: 'App',
  components: {
  },
  
  data () {
    return {
      tab: 'private',
      refresh_id: null
    }
  },
  methods: {
    is (what) {
      if (this.$route.name == what)
        return true
      return false
    },
  },
  watch: {

  },
  computed: {
    
  },
  mounted(){

  },

  created () {
   
   

  },
  beforeDestroy(){     
    clearTimeout(this.refresh_id);
  }
}
</script>
<style>

</style>