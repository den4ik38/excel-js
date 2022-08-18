import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom'

export class Formula extends ExcelComponent {
  static className = 'excel__formula'
  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      subscribe: ['currentText'],
      ...options
    })
  }

  toHTML() {
    return `
    <div class="info">fx</div>
    <div id='formula' class="input" contenteditable spellcheck="false"></div>
    `
  }

  init() {
    super.init()
    this.$formulaInput = this.$root.find('#formula')
    this.$on('Table:select', ($cell) => {
      this.$formulaInput.text($cell.data.value)
    })
  }

  storeChanged({currentText}) {
    this.$formulaInput.text(currentText)
  }

  onInput(event) {
    const text = $(event.target).text()
    this.$emit('Formula:input', text)
  }

  onKeydown(event) {
    const keys = ['Enter', 'Tab']
    if (keys.includes(event.key)) {
      event.preventDefault()
      this.$emit('Formula:done', event.target)
    }
  }
}
