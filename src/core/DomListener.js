import {capitalize} from './utils'

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('No provided $root for DomListener')
    }
    this.$root = $root
    this.listeners = listeners
  }


  initDomListeners() {
    this.listeners.forEach((listener) => {
      const method = getMethodName(listener)
      const name = this.name || ''
      if (!this[method]) {
        throw new Error(
            `Method ${method} is not implemented in ${name} Component`
        )
      }
      this[method] = this[method].bind(this)
      this.$root.on(listener, this[method])
    })
  }

  removeDomListeners() {
    this.listeners.forEach((listener) => {
      const method = getMethodName(listener)
      this.$root.off(listener, this[method])
    })
  }
}

function getMethodName(listener) {
  return 'on' + capitalize(listener)
}
