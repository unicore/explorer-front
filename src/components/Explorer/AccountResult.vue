<template lang="pug">
  div
    .text-center(
      v-if="!accountData"
    ) нет результатов
    div(v-else)
      h2 Аккаунт
        | {{" "}}
        span.text-weight-bold {{accountData.account.account_name}}
        .text-subtitle1(v-if="creatorName") создан
          | {{" "}}
          AccountLink(:account-name="creatorName")
          | {{" "}}
          | {{creationTime}}
      .row.q-col-gutter-sm
        .col.col-xs-6.col-md-3(
          v-for="card in cards",
          :key="card.title"
        )
          q-card(dark bordered).text-white.full-width.full-height
            q-card-section
              q-knob(
                disable
                v-model="card.value"
                show-value
                size="90px"
                :thickness="0.22"
                color="primary"
                track-color="grey-3"
                class="text-primary q-ma-md"
                v-if="card.type === 'knob'"
              )
              q-linear-progress(
                disable
                :value="card.value"
                show-value
                size="32px"
                color="secondary"
                track-color="teal"
                v-else-if="card.type === 'progress'"
              )
                .absolute-full.flex.flex-center
                  q-badge(
                    color="white"
                    text-color="accent"
                    :label="card.label"
                  )
              .text-h5(v-else) {{card.value}}
              .text {{card.title}}
              .text-subtitle1(v-if="card.subtitle") {{card.subtitle}}
      q-card(style="padding-top: 50px;").bg-primary.text-white.full-width
        q-tabs(
          v-model="tab"
          inline-label
          outside-arrows
          mobile-arrows
          
          align="justify"
          active-bg-color="teal"
          indicator-color="teal"
          
        )
          q-tab(name="actions" label="Действия")
          q-tab(name="tokens" label="Токены")
          q-tab(name="contract" label="Контракт")
        q-tab-panels(v-model="tab" animated dark)
          q-tab-panel(name="actions" style="padding: 0px !important;")
            ActionsByAccount(:account-name="accountData.account.account_name")
          q-tab-panel(name="tokens" style="padding: 0px !important; border: 1px solid grey;")
            TokensByAccount(:account-data="accountData")

          q-tab-panel(name="contract" style="padding: 0px !important; border: 1px solid grey;")
            ContractByAccount(:account-name="accountData.account.account_name")

</template>

<script>
import moment from 'moment'
import AccountLink from './AccountLink.vue'
import { formatBytes, formatUs } from './utils'

const progressCard = (title, subtitle, usage, quota) => ({
  title,
  subtitle,
  value: usage / quota,
  usage,
  quota,
  label: `${Math.round(usage / quota * 10000) / 100} %`,
  type: 'progress'
})

const formattedSubtitleProgressCard = (title, formatter, usage, quota) => progressCard(
  title,
  `${formatter(usage)} / ${formatter(quota)}`,
  usage,
  quota
)

const kbProgressCard = (title, usage, quota) => formattedSubtitleProgressCard(title, formatBytes, usage, quota)

const usProgressCard = (title, usage, quota) => formattedSubtitleProgressCard(title, formatUs, usage, quota)

export default {
  name: 'AccountResult',
  props: ['accountData', 'accountCreator'],
  components: {
    AccountLink,
    ActionsByAccount: () => import('./ActionsByAccount.vue'),
    TokensByAccount: () => import('./TokensByAccount.vue'),
    ContractByAccount: () => import('./contractByAccount.vue')

  },
  computed: {
    cards () {
      return [
        {
          title: 'Ликвидный баланс',
          value: this.accountData.account.core_liquid_balance,
          type: 'text'
        },
        kbProgressCard('RAM', this.accountData.account.ram_usage, this.accountData.account.ram_quota),
        kbProgressCard('NET', this.accountData.account.net_limit.used, this.accountData.account.net_limit.max),
        usProgressCard('CPU', this.accountData.account.cpu_limit.used, this.accountData.account.cpu_limit.max)
      ]
    },
    creatorName () {
      return this.accountCreator && this.accountCreator.creator
    },
    creationTime () {
      return this.accountCreator && moment(this.accountCreator.timestamp).format('DD.MM.YY')
    }
  },
  data () {
    return {
      tab: 'actions'
    }
  }
}
</script>
