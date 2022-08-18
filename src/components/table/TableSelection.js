export class TableSelection {
  static className = 'selected'
  constructor() {
    this.group = []
    this.current = null
  }


  select($el) {
    this.clear()
    $el.focus().addClass(TableSelection.className)
    this.current = $el
    this.group.push($el)
  }

  get selectedIds() {
    return this.group.map(($el) => $el.id())
  }

  clear() {
    this.group.forEach(($c) => {
      $c.removeClass(TableSelection.className)
    })
    this.group = []
  }

  selectGroup($group = []) {
    this.clear()
    this.group = $group
    this.group.forEach(($el) => $el.addClass(TableSelection.className))
  }

  applyStyle(style) {
    this.group.forEach(($el) => {
      $el.css(style)
    })
  }
}
