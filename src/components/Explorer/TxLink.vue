<template lang="pug">
  a(href="#" @click.prevent="openInExplorer")
    slot {{txid}}
</template>

<script>
export default {
  name: 'TxLink',
  props: ['txid'],
  methods: {
    openInExplorer () {
      this.$root.$emit('explorer:search', this.txid)
    }
  }
}
</script>
