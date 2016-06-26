import { combineReducers } from 'redux'
import {
  REQUEST_PODCAST,
  RECEIVE_PODCAST,
} from './constants'


export default function podcast(state = {}, action) {
  switch (action.type) {
    case REQUEST_PODCAST:
      return Object.assign({}, state, {
        isFetching: true,
        podcast: null,
      })
    case RECEIVE_PODCAST:
      return Object.assign({}, state, {
        isFetching: false,
        podcast: action.podcast,
      })
    default:
      return state
  }
}
