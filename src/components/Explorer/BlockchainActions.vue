<template lang="pug">
  div.q-mt-lg
    h2 Последние действия в блокчейне
    q-markup-table(dark bordered)
      thead
        tr
          th ID транзакции
          th Дата и время
          th Действие
          th.text-left Данные
      tbody
        tr(v-for="act in rows" :key="act.k")
          td.text-center
            TxLink(:txid="act.transaction_id")
              | {{act.transaction_id.substring(0, 12)}}
          td.text-center {{act.datetime}}
          td.text-center
            ActionCell(:action-data="act")
          td
            DataCell(:action-data="act.data" :action="act.action")
</template>

<script>
import moment from 'moment'
import DataCell from './DataCell.vue'
import ActionCell from './ActionCell.vue'
import TxLink from './TxLink.vue'

export default {
  name: 'BlockchainActions',
  components: {
    DataCell,
    ActionCell,
    TxLink
  },
  data () {
    return {
      timer: null,
      loading: false,
      rows: []
    }
  },
  computed: {
    explorerApiUrl () {
      return this.$store.getters['blockchain/getExplorerUrl']({ blockchain: this.$config.ual.rootChain })
    },
    explorerApi () {
      return this.$axios.create({
        baseURL: this.explorerApiUrl
      })
    }
  },
  mounted () {
    clearTimeout(this.timer)
    this.loadPage()
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    async loadPage () {
      this.loading = true
      const { data } = await this.explorerApi.get('v2/history/get_actions', {
        params: {
          limit: 32,
          skip: 0,
          noBinary: 'true',
          simple: 'true'
        }
      }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
      console.log(data)
      if (data) {
        this.rows = data.simple_actions.map((r, i) => ({
          ...r,
          k: `${i}-${r.action}-${r.transaction_id}-${r.contract}`,
          datetime: moment(r.timestamp).format('DD.MM.YY HH:mm:ss')
        }))
      }
      this.loading = false

      this.timer = setTimeout(() => {
        this.loadPage()
      }, 4000)
    }
  }
}
</script>
