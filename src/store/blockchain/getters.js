export const getChain = state => ({ blockchain }) => state.chains.find(chain => chain.name === blockchain)

export const getAPI = (state, getters) => ({ blockchain }) => {
  const chain = getters.getChain({ blockchain })
  return chain && chain.api
}

export const getExplorerUrl = (state, getters) => ({ blockchain }) => {
  const chain = getters.getChain({ blockchain })
  return chain && chain.explorerApiUrl
}

export const getBCInfo = state => state.bcinfo
