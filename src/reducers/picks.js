import { combineReducers } from 'redux'
import {
  REQUEST_PICKS,
  RECEIVE_PICKS,
  SELECT_PICKS_PAGE,
} from '../constants'


function selectedPage(state = 1, action) {
  switch (action.type) {
    case SELECT_PICKS_PAGE:
      return action.page
    default:
      return state
  }
}


function picks(state = {
  isFetching: false,
  items: [],
  page: 1,
}, action) {
  switch (action.type) {
    case REQUEST_PICKS:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case RECEIVE_PICKS:
      return Object.assign({}, state, {
        isFetching: false,
        page: action.page,
        items: action.items,
        pagination: action.pagination,
      })
    default:
      return state
  }
}


function picksByPage(state = { }, action) {
  switch (action.type) {
    // case INVALIDATE_SUBREDDIT:
    case RECEIVE_PICKS:
    case REQUEST_PICKS:
      return Object.assign({}, state, {
        [action.page]: picks(state[action.page], action)
      })
    default:
      return state
  }
}



const picksRootReducer = combineReducers({
  picksByPage,
  selectedPage,
})

export default picksRootReducer

//
// import {
//   ADD_PODCAST,
//   REMOVE_PODCAST,
//   REMOVE_ALL_PODCASTS,
// } from '../constants'
//
// const initialState = {
//   podcasts: []
// }
//
// export default function update(state = initialState.podcasts, action) {
//   if (action.type === ADD_PODCAST) {
//     return [action.podcast, ...state];
//   } else if (action.type === REMOVE_PODCAST) {
//     return state.filter(podcast => podcast.id !== action.podcast.id);
//   } else if (action.type === REMOVE_ALL_PODCASTS) {
//     return [];
//   }
//   return state
// }
