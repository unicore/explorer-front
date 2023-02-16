export function set_invites (state, invites){
  state.invites = invites
}

export function setUsername (state, username) {
  state.username = username
}

export function setEmail (state, email) {
  state.email = email
}

export function setReferer (state, referer) {
  state.referer = referer
}

export function setActivePubKey (state, activepubkey) {
  state.activepubkey = activepubkey
}

export function setOwnerPubKey (state, ownerpubkey) {
  state.ownerpubkey = ownerpubkey
}

export function setActivePrivKey (state, activeprivkey) {
  state.activeprivkey = activeprivkey
}

export function setOwnerPrivKey (state, ownerprivkey) {
  state.ownerprivkey = ownerprivkey
}

export function setAccountType(state, accountType){
  state.accountType = accountType
}

export function setAccountToPay(state, accountToPay){
  state.accountToPay = accountToPay
}

export function setEmailStatus(state, status){
  state.emailSended = status
}

export function setStep(state, step){
  state.step = step
}

export function setMnemonic(state, mnemonic){
  state.mnemonic = mnemonic
}

export function setLoader(state, status){
  state.loading = status
}
