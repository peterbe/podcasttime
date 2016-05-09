// import fetch from 'fetch'
import 'whatwg-fetch'

import {
  RECEIVE_PICKS,
  REQUEST_PICKS,
  SELECT_PICKS_PAGE,
 } from '../constants'


export function requestPicks(page = 1) {
  return {
    type: REQUEST_PICKS,
    page,
  }
}

export function selectPage(page = 1) {
  return {
    type: SELECT_PICKS_PAGE,
    page
  }
}

function receivePicks(page, json) {
  return {
    type: RECEIVE_PICKS,
    page: page,
    items: json.items,
    pagination: json.pagination,
  }
}

export function fetchPicks(page = 1) {
  return dispatch => {
    dispatch(selectPage(page))
    return fetch(`/api/picks/data/?page=${page}`)
      .then(response => response.json())
      .then(json => dispatch(receivePicks(page, json)))
  }
}

// export function fetchPostsIfNeeded(reddit) {
//   return (dispatch, getState) => {
//     if (shouldFetchPosts(getState(), reddit)) {
//       return dispatch(fetchPosts(reddit))
//     }
//   }
// }
