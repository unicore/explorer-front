<template lang="pug">
  .row.q-col-gutter-sm
    .col.col-xs-4(
      v-for="token in tokens",
      :key="token.contract"
    )
      q-card(dark bordered).text-white.full-width.full-height
        q-card-section
          .text-subtitle2 {{token.contract}}
          .text-h5(v-if="!hasFreeze(token.symbol)") {{token.amount}} {{token.symbol}}
          template(v-else)
            .text-h6 Доступно: {{token.amount}} {{token.symbol}}
            .text-subtitle(v-if="freezedTokens[token.symbol]") P2P заморожено: {{freezedTokens[token.symbol]}} {{token.symbol}}
            .text-subtitle(v-if="referralFreezedTokens[token.symbol]") Заморожено: {{referralFreezedTokens[token.symbol]}} {{token.symbol}}
</template>

<script>
import config from '@/config'

export default {
  name: 'TokensByAccount',
  props: ['accountData'],
  computed: {
    api () {
      return this.$store.getters['blockchain/getAPI']({ blockchain: this.$config.ual.rootChain })
    },
    tokens () {
      return this.accountData.tokens
    },
    accountName () {
      return this.accountData.account.account_name
    }
  },
  data () {
    return {
      freezedTokens: {},
      referralFreezedTokens: {}
    }
  },
  watch: {
    accountName: {
      handler () {
        this.loadFreezedTokens()
      },
      immediate: true
    }
  },
  methods: {
    hasFreeze (symbol) {
      return !!this.freezedTokens[symbol] || !!this.referralFreezedTokens[symbol]
    },
    async loadFreezedTokens () {
      const { rows: p2p } = await this.api.getTableRows(true, config.p2p, this.accountName, 'vesting', 'id', 0, -1, 1000)
      const { rows: referral } = await this.api.getTableRows(true, config.core, this.accountName, 'vesting', 'id', 0, -1, 1000)
      this.freezedTokens = {}
      this.referralFreezedTokens = {}
      for (const row of p2p) {
        const [amountS, symbol] = (row.amount || '').split(' ')

        const amount = Number(amountS)

        if (amount && symbol) {
          this.freezedTokens[symbol] = (this.freezedTokens[symbol] || 0) + amount
        }
      }
      for (const row of referral) {
        const [amountS, symbol] = (row.amount || '').split(' ')

        const amount = Number(amountS)

        if (amount && symbol) {
          this.referralFreezedTokens[symbol] = (this.referralFreezedTokens[symbol] || 0) + amount
        }
      }
    }
  }
}
</script>
