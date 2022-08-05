export function nextSelector(key, {col, row}) {
  const MIN_VALUE = 0
  switch (key) {
    case 'Enter':
    case 'ArrowDown':
      row++
      break
    case 'Tab':
    case 'ArrowRight':
      col++
      break
    case 'ArrowLeft':
      col - 1 < MIN_VALUE ? col : col--
      break
    case 'ArrowUp':
      row - 1 < MIN_VALUE ? row : row--
      break
  }
  return `[data-id="${row}:${col}"]`
}
