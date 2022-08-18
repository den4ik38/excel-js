import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from './table.template';
import {resizeHandler} from './table.resize'
import {TableSelection} from './TableSelection';
import {$} from '../../core/dom';
import {nextSelector} from './table.functions'
import * as actions from '../../redux/actionCreator'
import {defaultStyles} from '../../constants'
import {parse} from '@core/parse'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options
    })
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event)
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('Resize error', e.message);
    }
  }

  onMousedown(event) {
    if (event.target.dataset.resize) {
      this.resizeTable(event)
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
        this.selectCell($target)
      }
    }
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('Table:select', $cell)
    const style = $cell.getStyles(Object.keys(defaultStyles))
    this.$dispatch(actions.changeStyles(style))
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
      const id = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(event.key, id))
      this.selectCell($next)
    }
  }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }))
  }

  onInput(event) {
    this.updateTextInStore($(event.target).text())
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()

    const $cell = this.$root.find('[data-id="0:0"]')
    this.selectCell($cell)
    this.$on('Formula:input', (value) =>{
      this.selection.current
          .attr('data-value', value)
          .text(parse(value))
      this.updateTextInStore(value)
    })
    this.$on('Formula:done', () =>
      this.selection.current.focus())
    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds
      }))
    })
  }

  toHTML() {
    return createTable(20, this.store.getState())
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
