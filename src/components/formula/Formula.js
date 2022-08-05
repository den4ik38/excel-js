import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom'

export class Formula extends ExcelComponent {
  static className = 'excel__formula'
  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      ...options
    })
  }

  toHTML() {
    return `
    <div class="info">fx</div>
    <div id='input' class="input" contenteditable spellcheck="false"></div>
    `
  }

  init() {
    super.init()
    const $formulaInput = this.$root.find('#input')
    this.$on('Table:input', (text) => {
      $formulaInput.text(text)
    })
    this.$on('Table:select', ($cell) => {
      $formulaInput.text($cell.text())
    })
  }

  onInput(event) {
    this.$emit('Formula:input', $(event.target).text())
  }

  onKeydown(event) {
    const keys = ['Enter', 'Tab']
    if (keys.includes(event.key)) {
      event.preventDefault()
      this.$emit('Formula:done', event.target)
    }
  }
}
