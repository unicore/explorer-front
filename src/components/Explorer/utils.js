export const formatSize = (value, k, sizes, decimals = 2) => {
  if (!value) {
    return '0 ' + sizes[0]
  }

  const i = Math.floor(Math.log(value) / Math.log(k))

  return parseFloat((value / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

export const formatBytes = (bytes, decimals = 2) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  return formatSize(bytes, 1024, sizes, decimals)
}

export const formatUs = (us, decimals = 2) => {
  const sizes = ['us', 'ms', 's', 'Ks', 'Ms', 'Gs', 'Ts']

  return formatSize(us, 1000, sizes, decimals)
}

export const makeKb = s => {
  const x = Number(s) / 1024
  return `${Math.round(x * 100) / 100} KB`
}

export const makeMb = s => {
  const x = Number(s) / 1024 / 1024
  return `${Math.round(x * 100) / 100} mb`
}

export const percentString = (a, b = null, reversed = false) => {
  let x = b === null ? Number(a) : Number(a) / Number(b)
  if (reversed) {
    x = 1 - x
  }
  x = Math.round(x * 10000) / 100
  return `${x}%`
}
