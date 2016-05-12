import { combineReducers } from 'redux'
import {
  REQUEST_PODCASTS,
  RECEIVE_PODCASTS,
  SELECT_PODCASTS_PAGE,
} from './constants'


function selectedPage(state = 1, action) {
  switch (action.type) {
    case SELECT_PODCASTS_PAGE:
      return action.page
    default:
      return state
  }
}


function getPodcasts(state = {
  isFetching: false,
  totalCount: null,
  items: [],
  page: 1,
}, action) {
  switch (action.type) {
      case REQUEST_PODCASTS:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case RECEIVE_PODCASTS:
      return Object.assign({}, state, {
        isFetching: false,
        page: action.page,
        totalCount: action.count,
        items: action.items,
        pagination: action.pagination,
      })
    default:
      return state
  }
}


function podcastsByPage(state = { }, action) {
  switch (action.type) {
    case RECEIVE_PODCASTS:
    case REQUEST_PODCASTS:
      return Object.assign({}, state, {
        count: action.count,
        [action.page]: getPodcasts(state[action.page], action)
      })
    default:
      return state
  }
}



const podcasts = combineReducers({
  podcastsByPage,
  selectedPage,
})

export default podcasts
