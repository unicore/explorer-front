<template lang="pug">
  a(href="#" @click.prevent="openAccountInExplorer") {{accountName}}
</template>

<script>
export default {
  name: 'AccountLink',
  props: ['accountName'],
  methods: {
    openAccountInExplorer () {
      this.$root.$emit('explorer:search', this.accountName)
    }
  }
}
</script>
