import {ExcelComponent} from '@core/ExcelComponent'
import {defaultTitle} from '../../constants'
import {$} from '../../core/dom'
import {debounce} from '../../core/utils'
import {changeTitle} from '../../redux/actionCreator'

export class Header extends ExcelComponent {
  static className = 'excel__header'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['input'],
      ...options
    })
  }

  prepare() {
    this.onInput = debounce(this.onInput, 500)
  }


  toHTML() {
    const title = this.store.getState().titleState || defaultTitle
    return `
    <input type="text" class="input" value="${title}" />

    <div>

      <div class="button">
        <i class="material-icons">delete</i>
      </div>

      <div class="button">
        <i class="material-icons">exit_to_app</i>
    </div>
`
  }

  onInput(event) {
    const $target = $(event.target)
    this.$dispatch(changeTitle($target.text()))
  }
}
