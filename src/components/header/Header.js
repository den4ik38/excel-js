import {ExcelComponent} from '@core/ExcelComponent'
import {defaultTitle} from '../../constants'
import {$} from '../../core/dom'
import {ActiveRoute} from '@core/router/activeRoute'
import {debounce} from '../../core/utils'
import {changeTitle} from '../../redux/actionCreator'

export class Header extends ExcelComponent {
  static className = 'excel__header'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['input', 'click'],
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

      <div class="button" data-button="delete">
        <i class="material-icons" data-button="delete">delete</i>
      </div>

      <div class="button" data-button="exit">
        <i class="material-icons" data-button="exit">exit_to_app</i>
    </div>
`
  }

  onClick(event) {
    const $target =$(event.target)
    if ($target.data.button === 'delete') {
      const decision = confirm('Вы действительно холтите удалить эту таблицу?')
      if (decision) {
        localStorage.removeItem('excel:' + ActiveRoute.param)
        ActiveRoute.navigate('')
      }
    } else if ($target.data.button === 'exit') {
      ActiveRoute.navigate('')
    }
  }

  onInput(event) {
    const $target = $(event.target)
    this.$dispatch(changeTitle($target.text()))
  }
}
