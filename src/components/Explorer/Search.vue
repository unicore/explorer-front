<template lang="pug">
  .q-pt-lg
    q-input(
      v-model.trim="query"
      filled
      label="введите имя аккаунта / id транзакции / номер блока или выберите контракт"
      dark
      standout="bg-teal text-white"
      color="teal"
      @keypress.enter="search()"
    )
      template(v-slot:prepend)
        q-icon(name="search")
    div(v-if="showButtons").row
      div.col-3.col-xs-6
        q-btn(flat dark @click="search('eosio')").full-width eosio | контракт системного консенсуса
      div.col-3.col-xs-6
        q-btn(flat dark @click="search('unicore')").full-width unicore | контракт финансового реактора
      div.col-3.col-xs-6
        q-btn(flat dark @click="search('part')").full-width part | контракт партнёрских отношений
      div.col-3.col-xs-6
        q-btn(flat dark @click="search('registrator')").full-width registrator | контракт регистраций


    .q-pt-lg
      AccountResult(
        v-if="mode === 'account'"
        :account-data="accountData"
        :account-creator="accountCreator"
        :key="`search-account-${n}`"
      )
      TxResult(
        v-else-if="mode === 'tx'"
        :data="txData"
        :key="`search-tx-${n}`"
      )
      BlockResult(
        v-else-if="mode === 'block'"
        :data="blockData"
        :key="`search-block-${n}`"
      )
      BlockchainActions(
        v-else
        :key="`blockchain-actions-${n}`"
      )
</template>

<script>//
export default {
  name: 'Search',
  components: {
    AccountResult: () => import('./AccountResult.vue'),
    TxResult: () => import('./TxResult.vue'),
    BlockResult: () => import('./BlockResult.vue'),
    BlockchainActions: () => import('./BlockchainActions.vue')
  },
  data () {
    return {
      query: "",
      mode: '',
      accountData: null,
      accountCreator: null,
      txData: null,
      blockData: null,
      n: 0
    }
  },
  mounted () {
    if (this.route_query){
      console.log('on query', this.route_query)
      this.search(this.route_query)
    }

    this.$root.$on('explorer:search', query => {
      this.search(query)
    })
  },
  computed: {
    showButtons(){
      return this.$config.showButtons
    },
    route_query(){
      return this.$route.params.query
    },
    api () {
      return this.$store.getters['blockchain/getAPI']({ blockchain: this.$config.ual.rootChain })
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
  methods: {
    clear () {
      this.mode = ''
      this.query = ''
      this.accountData = null
      this.accountCreator = null
      this.txData = null
      this.blockData = null
      this.n++
    },
    async search (forcedValue, forcedMode) {
      
      if (this.$route.params.query != forcedValue)
        this.$router.push({name: 'home', params: {query: forcedValue}})

      if (forcedValue) {
        this.query = forcedValue
      }

      if (this.query === '') {
        this.clear()
        return
      }

      let mode = ''

      if (forcedMode) {
        mode = forcedMode
      } else if (/(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(this.query)) {
        mode = 'account'
      } else if (/(^\d{1,13}$)/.test(this.query)) {
        mode = 'block'
      } else if (this.query.length === 64) {
        mode = 'tx'
      }

      if (!mode) {
        this.$q.notify({
          message: 'Некорректный поисковый запрос',
          color: 'negative',
          classes: 'notify-class'
        })
        return
      }
      if (mode === 'account') {
        const accountName = this.query
        {
          const { data } = await this.explorerApi.get('v2/state/get_account', {
            params: {
              account: accountName
            }
          }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
          this.accountData = data
          // console.log(this.accountData)
          // if (this.accountData)
         

          const code = await this.api.getCodeHash(accountName).catch(() => ({ data: null })) // 
          console.log(code)
        }
        {
          const { data } = await this.explorerApi.get('v2/history/get_creator', {
            params: {
              account: accountName
            }
          }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
          this.accountCreator = data
        }
        if (!this.accountData && /(^\d{1,13}$)/.test(this.query)) {
          mode = 'block'
        }
      }

      if (mode === 'tx') {
        const txid = this.query
        const { data } = await this.explorerApi.get('v2/history/get_transaction', {
          params: {
            id: txid
          }
        }).catch(() => ({ data: null })) // TODO: нормальная обработка ошибок
        this.txData = data
      }

      if (mode === 'block') {
        const block = this.query
        // TODO: нормальная обработка ошибок
        this.blockData = await this.api.getBlock(block).catch(() => null)
      }

      if (mode !== 'account') {
        this.accountData = null
        this.accountCreator = null
      }

      if (mode !== 'tx') {
        this.txData = null
      }

      if (mode !== 'block') {
        this.blockData = null
      }

      this.mode = mode
      this.n++
    }
  }
}
</script>
