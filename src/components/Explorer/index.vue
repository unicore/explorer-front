<template lang="pug">
  .q-pa-md
    h1 Блокчейн {{$config.ual.rootChain.toUpperCase()}}
    .row.q-col-gutter-sm
      .col-xs-12.col-md-3(
        v-for="status in chainMainStatus",
        :key="status.title"
      )
        q-card(dark bordered).text-white.full-width
          q-card-section
            .text-h6 {{status.value}}
            .text-subtitle2 {{status.title}}
    Search
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Search from './Search.vue'
import { makeKb, makeMb, percentString } from './utils'

export default {
  components: {
    Search
  },
  name: 'Explorer',
  data () {
    return {
      api: null,
      loadMemCpuTimer: null,
      eosStatus: {},
      interval: null,
      reserveBalance: "0.0000 " + this.$config.core_symbol,
      coreStats: {supply: "0.0000 " + this.$config.core_symbol},
    }
  },
  mounted () {
    this.init()
    this.interval = setInterval(() => this.$store.dispatch('blockchain/get_info'), 500)
  },
  methods: {
    ...mapActions({
      'getInfo': "blockchain/get_info"
    }),
    init () {
      this.api = this.$store.getters['blockchain/getAPI']({ blockchain: this.$config.ual.rootChain })
      this.loadMemCpuInfo()
    },
    async loadMemCpuInfo () {
      const { rows: [data] } = await this.api.getTableRows(true, 'eosio', 'eosio', 'global')
      this.eosStatus = data

      const [wallet] = await this.api.getCurrencyBalance("eosio.token", "reserve", this.$config.core_symbol)
      this.reserveBalance = wallet

      const stats = await this.api.getCurrencyStats("eosio.token", this.$config.core_symbol)
      console.log('statsu: ', stats)
      this.coreStats = stats[this.$config.core_symbol]
      console.log("statsu2", this.coreStats.supply)

      this.loadMemCpuTimer = setTimeout(() => {
        this.loadMemCpuInfo()
      }, 20000)
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
    clearTimeout(this.loadMemCpuTimer)
  },
  computed: {
    ...mapGetters({
      'bcinfo': 'blockchain/getBCInfo'
    }),
    chainRamSize () {
      return Number(this.eosStatus.max_ram_size)
    },
    ramBought () {
      return Number(this.eosStatus.total_ram_bytes_reserved)
    },
    ramFree () {
      return Number(this.eosStatus.max_ram_size) - this.ramBought
    },
    bc () {
      return this.bcinfo || {}
    },
    chainMainStatus () {
      return [
        {
          title: 'Текущий блок',
          value: this.bc.head_block_num
        },
        // {
        //   title: 'Производитель',
        //   value: this.bc.head_block_producer
        // },
        {
          title: 'Всего токенов',
          value: this.coreStats.supply
        },
        {
          title: 'В обороте',
          value: (parseFloat(this.coreStats.supply) - parseFloat(this.reserveBalance)).toFixed(4) + " " + this.$config.core_symbol
        },
        {
          title: 'В резервном фонде',
          value: this.reserveBalance
        },
        {
          title: 'Использование CPU',
          value: percentString(this.bc.block_cpu_limit, this.eosStatus.max_block_cpu_usage, true)
        },
        {
          title: 'Использование NET',
          value: percentString(this.bc.block_net_limit, this.eosStatus.max_transaction_net_usage, true)
        },
        // {
        //   title: 'Размер RAM сети',
        //   value: makeMb(this.chainRamSize)
        // },
        // {
        //   title: 'RAM куплено',
        //   value: makeMb(this.ramBought)
        // },
        {
          title: 'RAM на рынке',
          value: makeMb(this.ramFree)
        },
        {
          title: 'Использование RAM',
          value: percentString(this.ramBought, this.chainRamSize)
        },
        
      ]
    }
  }
}
</script>
