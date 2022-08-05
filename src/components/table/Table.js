import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from './table.template';
import {resizeHandler} from './table.resize'
import {TableSelection} from './TableSelection';
import {$} from '../../core/dom';
import {nextSelector} from './table.functions'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options
    })
  }

  onMousedown(event) {
    if (event.target.dataset.resize) {
      resizeHandler(this.$root, event)
    } else if (event.target.dataset.type === 'cell') {
      const $target = $(event.target)
      if (event.shiftKey) {
        const current = this.selection.current.id(true)
        const target = $target.id(true)
        const cols = range(current.col, target.col)
        const rows = range(current.row, target.row)

        const matrix = cols.reduce((acc, col)=>{
          rows.forEach((row) => acc.push(`${row}:${col}`))
          return acc
        }, [])
        const cells = matrix.map((id) => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup(cells)
      } else {
        this.selection.select($target)
      }
    }
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('Table:select', $cell)
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowRight',
      'ArrowLeft',
      'ArrowDown',
      'ArrowUp'
    ]

    if (keys.includes(event.key) && !event.shiftKey) {
      event.preventDefault()
      const current = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(event.key, current))
      this.selectCell($next)
    }
  }
  onInput(event) {
    this.$emit('Table:input', $(event.target).text())
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()

    const $cell = this.$root.find('[data-id="0:0"]')
    this.selectCell($cell)
    this.$on('Formula:input', (text) =>
      this.selection.current.text(text))
    this.$on('Formula:done', () =>
      this.selection.current.focus())
  }

  toHTML() {
    return createTable()
  }
}


function range(start, end) {
  if (start > end) {
    [end, start]=[start, end]
  }
  return new Array(end - start + 1)
      .fill('')
      .map((_, index) => start + index)
}
