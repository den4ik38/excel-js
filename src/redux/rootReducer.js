import {TABLE_RESIZE, CHANGE_TEXT, CHANGE_STYLES, APPLY_STYLES,
  CHANGE_TITLE, UPDATE_DATE} from './types'

export function rootReducer(state, action) {
  let field
  let prevState
  let value
  switch (action.type) {
    case TABLE_RESIZE:
      field = action.data.type === 'col' ? 'colState' : 'rowState'
      prevState = state[field] || {}
      prevState[action.data.id] = action.data.value
      return {...state, [field]: prevState}
    case CHANGE_TEXT:
      prevState = state.dataState || {}
      prevState[action.data.id] = action.data.value
      return {...state, dataState: prevState, currentText: action.data.value}
    case CHANGE_STYLES:
      return {...state, currentStyles: action.data}
    case APPLY_STYLES:
      field = 'stylesState'
      value = state[field] || {}
      action.data.ids.forEach((id) => {
        value[id] = {...value[id], ...action.data.value}
      })
      return {
        ...state, [field]: value,
        currentStyles: {...state.currentStyles, ...action.data.value}
      }
    case CHANGE_TITLE:
      field = 'titleState'
      return {...state, [field]: action.data}
    case UPDATE_DATE:
      return {...state, openedDate: new Date().toJSON()}
    default: return state
  }
}
