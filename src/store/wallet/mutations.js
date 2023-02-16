import config from '@/config/index'

export function setWallet (state, wallet) {
  state.wallets.push(wallet)
}

export function setUsername (state, username) {
  state.username = username
}

export function showPartnerButton (state, status) {
  state.showPartnerButton = status
}

export function setWalletBalance (state, { name, contract, symbol, balance }) {
  let w = state.wallets.find(wallet => wallet.blockchain === name && wallet.contract === contract && wallet.symbol === symbol)
  if (w)
    w.balance = balance
  else {
    w = {
      blockchain: config.ual.rootChain,
      contract: contract,
      symbol: symbol,
      balance: balance
    }

    state.wallets.push(w)
  }
}
