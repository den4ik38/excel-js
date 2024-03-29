export function capitalize(string) {
  if (!string) {
    return ''
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function storage(key, data = null) {
  if (!data) {
    return JSON.parse(localStorage.getItem(key))
  }
  localStorage.setItem(key, JSON.stringify(data))
}

export function isEqual(a, b) {
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  return a === b
}

export function camelToDashCase(str) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
}

export function toInlineStyle(styles = {}) {
  return Object.keys(styles)
      .map((key) => `${camelToDashCase(key)}:${styles[key]}`)
      .join('; ')
}


export function debounce(fn, wait) {
  let timeOut
  return function(...args) {
    const later = () => {
      clearTimeout(timeOut)
      // eslint-disable-next-line no-invalid-this
      fn.apply(this, args)
    }
    clearTimeout(timeOut)
    timeOut = setTimeout(later, wait)
  }
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
