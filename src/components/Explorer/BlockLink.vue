<template lang="pug">
  a(href="#" @click.prevent="openInExplorer") {{number}}
</template>

<script>
export default {
  name: 'BlockLink',
  props: ['number'],
  methods: {
    openInExplorer () {
      this.$root.$emit('explorer:search', this.number, 'block')
    }
  }
}
</script>
