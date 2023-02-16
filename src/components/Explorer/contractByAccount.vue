<template lang="pug">
  div
    div.row
      div.col-6
        q-select(option-label="name" map-options emit-value color="secondary" dark filled v-model="table" :options="abi.tables" label="Таблица")
      div.col-6
        q-input(dark filled label="Область памяти" v-model="scope" color="secondary") 
    q-table(
      :loading="loading"
      title="Данные"
      :data="rows"
      :columns="columns"
      row-key="k"
      :pagination.sync="pagination"
      @request="changePageFromTable"
      dark
    )
    

    q-table(
      :loading="loading"
      title="Последние изменения"
      :data="deltas"
      :columns="deltaColumns"
      row-key="k"
      :pagination.sync="pagination"
      @request="changePageFromTable"
      dark
    )
      template(v-slot:body-cell-data="props")
        q-td(:props="props")
          DataCell(:action-data="props.value" :action="'action'")
</template>

<script>
import moment from 'moment'
import DataCell from './DataCell.vue'
import ActionCell from './ActionCell.vue'
import TxLink from './TxLink.vue'

export default {
  name: 'ContractByAccount',
  props: ['accountName'],
  components: {
    DataCell,
    ActionCell,
    TxLink
  },
  data () {
    return {
      api: null,
      table: [],
      scope: this.accountName,
      abi: {table: null},
      loading: false,
      rows: [],
      deltas: [],
      deltaColumns: [
        {
          name: 'block_id',
          required: true,
          label: 'ID транзакции',
          align: 'left',
          field: row => row.block_id
        },
        {
          name: 'timestamp',
          required: true,
          label: 'Дата и время',
          align: 'left',
          field: row => moment(row.timestamp).format('DD.MM.YY HH:mm:ss')
        },
        {
          name: 'Контракт',
          required: true,
          label: 'Контракт',
          align: 'left',
          field: row => row.code
        },
        {
          name: 'Область памяти',
          required: true,
          label: 'Область памяти',
          align: 'left',
          field: row => row.scope
        },
        {
          name: 'data',
          required: true,
          label: 'Данные',
          align: 'left',
          field: row => row.data
        },
        
      ],
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      }
    }
  },
  computed: {
    columns (){
      let columns = []
      
      if (this.rows && this.rows[0]){
      
        let keys = Object.keys(this.rows[0]);
        // console.log('keys: ', keys)
        keys.map(key => {
          columns.push({
            name: key,
            required: true,
            label: key,
            align: 'left',
            field: row => row[key]
          })
        })
        // console.log('col:', columns)
        return columns
      } else {
        return []
      }
    

    },
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
  created(){
    this.api = this.$store.getters['blockchain/getAPI']({ blockchain: this.$config.ual.rootChain })
  },
  watch: {
    table: {
      handler () {
        this.loadTable()
      }
    },
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
    async loadTable() {
      this.loading = true
      
      const { rows: data } = await this.api.getTableRows(true, this.accountName, this.scope, this.table.name)
      if (data) {
        this.pagination = {
          ...this.pagination,
          rowsNumber: data.length
        }
        this.rows = data
        // this.rows = data.map((r, i) => ({ ...r, k: `${i}-${r.action}-${r.transaction_id}-${r.contract}` }))
      }

       const deltas = await this.explorerApi.get('v2/history/get_deltas', {
        params: {
          code: this.accountName,
          table: this.table.name,
          scope: this.scope
        }
      }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
      
      this.loading = false
      this.deltas = deltas.data.deltas
      console.log(this.deltas)
    },
    async loadPage () {
      if (this.loading) {
        return
      }
      this.loading = true
      const { data } = await this.explorerApi.get('v2/history/get_abi_snapshot', {
        params: {
          contract: this.accountName,
          fetch: true
        }
      }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
      console.log("abi: ", data, this.accountName,)
      this.abi = data.abi
      // if (data) {
        // this.pagination = {
        //   ...this.pagination,
        //   rowsNumber: data.total.value
        // }
        // this.rows = data.abi.tables.map((r, i) => ({ ...r, k: `${i}-${r.action}-${r.transaction_id}-${r.contract}` }))
      // }
       const deltas = await this.explorerApi.get('v2/history/get_deltas', {
        params: {
          code: this.accountName
        }
      }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
      
      this.deltas = deltas.data.deltas
      console.log(this.deltas)
      this.loading = false
    }
  }
}
</script>
