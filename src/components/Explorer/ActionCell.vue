<template lang="pug">
  q-badge(:color="badgeColor" :class="badgeTextColor")
    template(v-if="contract") {{contract}} → {{actionName}}
    template(v-else) {{actionName}}
</template>

<script>
const getActionContract = (row, actionName) => {
  const { contract, action } = row
  if (contract && ((contract !== 'eosio.token' && contract !== 'eosio') || action === actionName)) {
    return contract
  }
  return ''
}

const ACTION_TYPES = {
  OTHER: 'OTHER',
  BUYRAM: 'BUYRAM',
  STAKECPUNET: 'STAKECPUNET',
  SENDTOKEN: 'SENDTOKEN',
  RECEIVETOKEN: 'RECEIVETOKEN',
  RAMFEE: 'RAMFEE'
}

const ACTION_NAMES = {
  [ACTION_TYPES.OTHER]: null,
  [ACTION_TYPES.BUYRAM]: 'Покупка RAM',
  [ACTION_TYPES.STAKECPUNET]: 'Ставка CPU/NET',
  [ACTION_TYPES.SENDTOKEN]: 'Отправка токенов',
  [ACTION_TYPES.RECEIVETOKEN]: 'Приём токенов',
  [ACTION_TYPES.RAMFEE]: 'Продажа RAM'
}

const ACTION_BADGE_COLORS = {
  [ACTION_TYPES.OTHER]: 'white',
  [ACTION_TYPES.BUYRAM]: 'red',
  [ACTION_TYPES.STAKECPUNET]: 'blue',
  [ACTION_TYPES.SENDTOKEN]: 'red',
  [ACTION_TYPES.RECEIVETOKEN]: 'green',
  [ACTION_TYPES.RAMFEE]: 'red'
}

const getActionType = (row, currentAccount) => {
  const { data } = row
  if (row.action === 'transfer') {
    if (data.from === currentAccount || !currentAccount) {
      if (data.to === 'eosio.ramfee') {
        return ACTION_TYPES.RAMFEE
      }
      return ACTION_TYPES.SENDTOKEN
    } else if (data.to === currentAccount) {
      return ACTION_TYPES.RECEIVETOKEN
    }
  } else if (row.action === 'delegatebw') {
    return ACTION_TYPES.STAKECPUNET
  } else if (row.action === 'buyram') {
    return ACTION_TYPES.BUYRAM
  }
  return ACTION_TYPES.OTHER
}

const getActionNameByType = (action, actionType) => {
  return ACTION_NAMES[actionType] || action
}

export default {
  name: 'ActionCell',
  props: ['actionData', 'account'],
  computed: {
    actionType () {
      return getActionType(this.actionData, this.account)
    },
    actionName () {
      return getActionNameByType(this.actionData.action, this.actionType)
    },
    contract () {
      return getActionContract(this.actionData, this.actionName)
    },
    badgeColor () {
      return ACTION_BADGE_COLORS[this.actionType] || ACTION_BADGE_COLORS.OTHER
    },
    badgeTextColor () {
      if (this.badgeColor === 'white') {
        return 'text-black'
      }
      return ''
    }
  }
}
</script>
