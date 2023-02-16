<template lang="pug">
  div
    .text-center(
      v-if="!data"
    ) нет результатов
    template(v-else)
      q-card(dark bordered).text-white.q-pa-md.q-mb-md
        h2.q-mb-xs Транзакция
        span.text-weight-bold {{data.trx_id}}
        q-separator(dark).q-mt-md.q-mb-md
        .row.q-col-gutter-sm
          .col-xs-6
            q-markup-table(dark bordered).bg-primary
              thead
                tr
                  th(colspan="2") Общая информация
              tbody
                tr
                  td.text-left Номер блока
                  td.text-left
                    BlockLink(:number="blockNumber")
                tr
                  td.text-left Время блока
                  td.text-left {{blockTime}}
                tr
                  td.text-left Статус
                  td(v-if="executed").text-left
                    q-badge(color="green") Выполнено
                  td(v-else).text-left
                    q-badge(color="orange") Не выполнено
          .col-xs-6
            q-markup-table(dark bordered).bg-primary
              thead
                tr
                  th(colspan="2") Дополнительная информация
              tbody
                tr
                  td.text-left Использование CPU
                  td.text-left {{cpuTime}}
                tr
                  td.text-left Использование NET
                  td.text-left {{netUsage}}
                tr
                  td.text-left Количество действий
                  td.text-left {{data.actions.length}}
      q-card(dark bordered).text-white.q-pa-md.q-mb-md
        h2.q-mb-xs Действия
        q-markup-table(dark)
          thead
            tr
              th Контракт
              th Название
              th Авторизации
              th Данные
          tbody
            tr(v-for="action in data.actions")
              td.text-left
                AccountLink(:account-name="action.act.account")
              td.text-left {{action.act.name}}
              td.text-left
                ul.q-pl-md
                  li(v-for="auth in action.act.authorization")
                    q-badge(color="blue") {{auth.actor}}
                    q-badge(color="indigo-10") {{auth.permission}}
              td.lext-left
                DataCell(:action="action.act.name" :actionData="action.act.data")
</template>

<script>
import moment from 'moment'
import AccountLink from './AccountLink.vue'
import DataCell from './DataCell.vue'
import BlockLink from './BlockLink.vue'
import { formatBytes, formatUs } from './utils'

export default {
  name: 'TxResult',
  props: ['data'],
  components: { DataCell, AccountLink, BlockLink },
  computed: {
    firstAction () {
      if (!this.data || !this.data.actions || this.data.actions.length === 0) {
        return {}
      }

      const a = this.data.actions.find(x => x.cpu_usage_us && x.net_usage_words)

      if (a) {
        return a
      }

      return this.data.actions[0]
    },
    blockNumber () {
      return this.firstAction.block_num
    },
    blockTime () {
      return moment(this.firstAction.timestamp).format('DD.MM.YYYY HH:mm:ss')
    },
    executed () {
      return this.data.executed
    },
    cpuTime () {
      return formatUs(this.firstAction.cpu_usage_us)
    },
    netUsage () {
      return formatBytes((this.firstAction.net_usage_words * 8) || 0)
    }
  }
}
</script>
