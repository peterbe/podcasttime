import 'whatwg-fetch'

import {
  RECEIVE_PODCASTS,
  REQUEST_PODCASTS,
  SELECT_PODCASTS_PAGE,
 } from './constants'


export function requestPodcasts(page = 1) {
  return {
    type: REQUEST_PODCASTS,
    page,
  }
}

export function selectPage(page = 1) {
  return {
    type: SELECT_PODCASTS_PAGE,
    page
  }
}

function receivePodcasts(page, json) {
  return {
    type: RECEIVE_PODCASTS,
    page: page,
    items: json.items,
    pagination: json.pagination,
  }
}

export function fetchPodcasts(page = 1) {
  return dispatch => {
    dispatch(selectPage(page))
    return fetch(`/api/podcasts/data/?page=${page}`)
      .then(response => response.json())
      .then(json => dispatch(receivePodcasts(page, json)))
  }
}

// export function fetchPostsIfNeeded(reddit) {
//   return (dispatch, getState) => {
//     if (shouldFetchPosts(getState(), reddit)) {
//       return dispatch(fetchPosts(reddit))
//     }
//   }
// }
