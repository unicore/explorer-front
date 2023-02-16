
export function setWif (state, req) {
  const existedAccount = state.accountNames.find(account => account.blockchain === req.blockchain && account.username === req.username && account.method === req.method)
  if (!existedAccount) {
    state.accountNames.push(req)
  } else {
    existedAccount.wif = req.wif
  }
}



export function push_new_name (state, name) {
  state.accountNames.push(name)
}


export function setCommunity (state, community) {
  state.community = community
}

export function setConditions(state, conditions){
  state.conditions = conditions
}

export function setPartners(state, partners){
  state.partners = partners
}

export function setIsPartner(state, isPartner){
  state.isPartner = isPartner
}

export function setPartner(state, partner){
  state.partner = partner
}

export function setPartnerLevel(state, level){
  state.partnerLevel = level
}


export function setIsGuestStatus(state, isGuest){
  state.isGuest = isGuest
}

export function setGuest(state, guest){
  state.guest = guest
}


export function setRootWif (state, wif) {
  state.wif = wif
}
export function setUsername (state, username) {
  state.username = username
}

export function setAuthStatus (state, status) {
  state.isAuth = status
}

export function setAuthMethod (state, method) {
  state.authMethod = method
}

export function setLoggedUser (state, loggedUsers) {
  state.loggedUsers = loggedUsers
}

export function setAutoLogin (state, status) {
  state.autoLogin = status
}

export function setLoggedInBlockchain (state, blockchain) {
  state.loggedInBlockchain = blockchain
}

export function setAccountNames (state, accountNames) {
  state.accountNames = accountNames
}

export function toogleDialog (state){
  state.showDialog = !state.showDialog
}

export function showDialog(state, status){
  state.showDialog = status
}

export function showReg(state, status){
  state.showReg = status
}