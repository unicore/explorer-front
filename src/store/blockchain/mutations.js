// DELETE IT
export function setActiveChain (state, name) {
  state.activeChain = state.Chains[name]
  state.activeChain.name = name
}

// DELETE IT
export function setRPC (state, rpc) {
  state.rpc = rpc
}

export function setAPI (state, chain) {
  state.chains.push(chain)
}

export function setrammarket(state, rammarket){
  state.rammarket = rammarket
}

  export function set_info (state, bcinfo)  {
    state.bcinfo = bcinfo

  }

  export function setproducers(state, producers){
    state.producers = producers
  }