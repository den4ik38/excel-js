import {$} from '../../core/dom'

export function resizeHandler($root, event) {
  return new Promise((resolve) => {
    const $target = $(event.target)
    const $parent = $target.closest('[data-type="resizable"]')
    const coords = $parent.getCoords()
    const cells = $root.findAll(`[data-col="${$parent.data.col}"]`)
    const sideProp = $target.data.resize === 'col' ? 'bottom' : 'right'
    const type = event.target.dataset.resize
    let value
    $target.css({
      opacity: 1,
      [sideProp]: '-5000px'
    })
    document.onmousemove = (e) => {
      if (event.target.dataset.resize === 'col') {
        const delta = e.pageX - coords.right
        value = coords.width + delta
        $target.css({right: -delta + 'px'})
      } else {
        const delta = e.pageY - coords.bottom
        value = coords.height + delta
        $target.css({bottom: -delta + 'px'})
      }
    }

    document.onmouseup = (e) => {
      document.onmousemove = null
      document.onmouseup = null
      if ($target.data.resize === 'col') {
        $parent.css({width: value + 'px'})
        cells.forEach( (el) => {
          el.style.width = value + 'px'
        })
      } else {
        $parent.css({height: value + 'px'})
      }
      resolve({
        value,
        type,
        id: type === 'col' ? $parent.data.col : $parent.data.row
      })
      $target.css({
        right: 0,
        opacity: 0,
        bottom: 0
      })
    }
  })
}
