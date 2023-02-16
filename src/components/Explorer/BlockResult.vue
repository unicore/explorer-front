<template lang="pug">
  div
    .text-center(
      v-if="!data"
    ) нет результатов
    template(v-else)
      q-card(dark bordered).text-white.q-pa-md.q-mb-md
        h2.q-mb-xs Блок {{data.block_num}}
        q-separator(dark).q-mt-md.q-mb-md
        .row.q-col-gutter-sm
          .col-xs-6
            q-markup-table(dark bordered).bg-primary
              thead
                tr
                  th(colspan="2") Общая информация
              tbody
                tr
                  td.text-left Высота блока
                  td.text-left {{data.block_num}}
                tr
                  td.text-left Дата и время блока
                  td.text-left {{blockTime}}
                tr
                  td.text-left Имя производителя
                  td.text-left
                    AccountLink(:account-name="data.producer")
                tr
                  td.text-left Block ID
                  td.text-left(style="white-space: normal;word-break: break-all") {{data.id}}
          .col-xs-6
            q-markup-table(dark bordered).bg-primary
              thead
                tr
                  th(colspan="2") Дополнительная информация
              tbody
                tr
                  td.text-left Предыдущий блок
                  td.text-left
                    BlockLink(:number="prevBlock")
                tr
                  td.text-left Следующий блок
                  td.text-left
                    BlockLink(:number="nextBlock")
                tr
                  td.text-left Количество транзакций
                  td.text-left {{data.transactions.length}}
      q-card(dark bordered).text-white.q-pa-md.q-mb-md
        h2.q-mb-xs Транзакции
        q-markup-table(dark)
          thead
            tr
              th ID транзакции
              th Expiration
              th Использование CPU
              th Использование NET
              th Количество действий
          tbody
            tr(v-for="tx in data.transactions" :key="tx.trx.id")
              td
                TxLink(:txid="tx.trx.id")
              td {{tx.trx.transaction.expiration}}
              td {{formatUs(tx.cpu_usage_us)}}
              td {{formatBytes(tx.net_usage_words)}}
              td {{tx.trx.transaction.actions.length}}
</template>

<script>
import moment from 'moment'
import AccountLink from './AccountLink.vue'
import BlockLink from './BlockLink.vue'
import TxLink from './TxLink.vue'
import { formatBytes, formatUs } from './utils'

export default {
  name: 'BlockResult',
  props: ['data'],
  components: { AccountLink, BlockLink, TxLink },
  computed: {
    blockTime () {
      return moment(this.data.timestamp).format('DD.MM.YYYY HH:mm:ss')
    },
    prevBlock () {
      return this.data.block_num - 1
    },
    nextBlock () {
      return this.data.block_num + 1
    }
  },
  methods: {
    formatBytes (b) {
      return formatBytes(b)
    },
    formatUs (us) {
      return formatUs(us)
    }
  }
}
</script>
