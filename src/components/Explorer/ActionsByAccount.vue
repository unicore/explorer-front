<template lang="pug">
  div(style="border: 1px solid grey;")
    q-table(
      :loading="loading"
      title="Действия"
      :data="rows"
      :columns="columns"
      row-key="k"
      :pagination.sync="pagination"
      @request="changePageFromTable"
      dark
    )
      template(v-slot:body-cell-transaction_id="props")
        q-td(:props="props")
          TxLink(:txid="props.row.transaction_id")
            | {{props.row.transaction_id.substring(0, 10)}}
      template(v-slot:body-cell-data="props")
        q-td(:props="props")
          DataCell(:action-data="props.value" :action="props.row.action")
      template(v-slot:body-cell-action="props")
        q-td(:props="props")
          ActionCell(:action-data="props.value" :account="accountName")
</template>

<script>
import moment from 'moment'
import DataCell from './DataCell.vue'
import ActionCell from './ActionCell.vue'
import TxLink from './TxLink.vue'

export default {
  name: 'ActionsByAccount',
  props: ['accountName'],
  components: {
    DataCell,
    ActionCell,
    TxLink
  },
  data () {
    return {
      loading: false,
      rows: [],
      columns: [
        {
          name: 'transaction_id',
          required: true,
          label: 'ID транзакции',
          align: 'left',
          field: row => row.transaction_id
        },
        {
          name: 'timestamp',
          required: true,
          label: 'Дата и время',
          align: 'left',
          field: row => moment(row.timestamp).format('DD.MM.YY HH:mm:ss')
        },
        {
          name: 'action',
          required: true,
          label: 'Действие',
          align: 'left',
          field: row => row
        },
        {
          name: 'data',
          required: true,
          label: 'Данные',
          align: 'left',
          field: row => row.data
        },
        {
          name: 'memo',
          required: true,
          label: 'Памятка',
          align: 'right',
          field: row => row.data.memo
        }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      }
    }
  },
  computed: {
    page () {
      return this.pagination.page
    },
    explorerApiUrl () {
      return this.$store.getters['blockchain/getExplorerUrl']({ blockchain: this.$config.ual.rootChain })
    },
    explorerApi () {
      return this.$axios.create({
        baseURL: this.explorerApiUrl
      })
    }
  },
  watch: {
    page: {
      immediate: true,
      handler () {
        this.loadPage()
      }
    }
  },
  methods: {
    changePageFromTable (e) {
      if (e && e.pagination) {
        this.pagination = e.pagination
        this.loadPage()
      }
    },
    async loadPage () {
      if (this.loading) {
        return
      }
      this.loading = true
      const { data } = await this.explorerApi.get('v2/history/get_actions', {
        params: {
          account: this.accountName,
          limit: this.pagination.rowsPerPage,
          skip: this.pagination.rowsPerPage * (this.page - 1),
          noBinary: 'true',
          simple: 'true'
        }
      }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
      console.log(data)
      if (data) {
        this.pagination = {
          ...this.pagination,
          rowsNumber: data.total.value
        }
        this.rows = data.simple_actions.map((r, i) => ({ ...r, k: `${i}-${r.action}-${r.transaction_id}-${r.contract}` }))
      }
      this.loading = false
    }
  }
}
</script>
