<template lang="pug">
  div(v-if="action === 'transfer'")
    AccountLink(:account-name="actionData.from")
    | {{" → "}}
    AccountLink(:account-name="actionData.to")
    | {{" "}}{{actionData.quantity}}
  div(v-else)
    ul.q-pl-md
      li(v-for="row in dataParams" :key="row.key")
        strong {{row.key}}:
        | {{" "}}
        AccountLink(v-if="row.isAccount" :account-name="row.value")
        template(v-else) {{row.value}}
</template>

<script>
import AccountLink from './AccountLink.vue'

const ACCOUNT_FIELDS = {
  from: 1,
  to: 1,
  owner: 1,
  payer: 1,
  receiver: 1,
  creator: 1,
  user_name: 1,
  account: 1,
  host: 1,
  root_contract: 1,
  notified: 1,
  contract: 1,
  username: 1
}
const isAccount = s => /(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(s)

export default {
  name: 'DataCell',
  props: ['actionData', 'action'],
  components: { AccountLink },
  computed: {
    dataParams () {
      return Object.keys(this.actionData).map(key => ({
        key,
        value: this.actionData[key],
        isAccount: !!ACCOUNT_FIELDS[key] && isAccount(this.actionData[key])
      }))
    }
  }
}
</script>
