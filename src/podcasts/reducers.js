import { combineReducers } from 'redux'
import {
  REQUEST_PODCASTS,
  RECEIVE_PODCASTS,
  SELECT_PODCASTS_PAGE,
  SET_PODCASTS_SEARCH,
} from './constants'


function selectedPage(state = 1, action) {
  switch (action.type) {
    case SELECT_PODCASTS_PAGE:
      return action.page
    default:
      return state
  }
}


function search(state = '', action) {
  switch (action.type) {
    case SET_PODCASTS_SEARCH:
      return action.search
    default:
      return state
  }
}


function getPodcasts(state = {
  isFetching: false,
  totalCount: null,
  items: [],
  search: '',
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
        search: action.search,
        totalCount: action.count,
        items: action.items,
        pagination: action.pagination,
      })
    default:
      return state
  }
}


function podcastsByPage(state = { }, action) {
  // console.log("In podcastsByPage", action, state);
  switch (action.type) {
    case RECEIVE_PODCASTS:
      let key = 'p:' + action.page + 'search:' + action.search
      return Object.assign({}, state, {
        count: action.count,
        [key]: getPodcasts(state[key], action)
      })
    default:
      return state
  }
}



const podcasts = combineReducers({
  podcastsByPage,
  selectedPage,
  search,
})

export default podcasts
