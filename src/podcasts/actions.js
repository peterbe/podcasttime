import 'whatwg-fetch'

import {
  RECEIVE_PODCASTS,
  REQUEST_PODCASTS,
  SELECT_PODCASTS_PAGE,
  SET_PODCASTS_SEARCH,
 } from './constants'


// export function requestPodcasts(page = 1) {
//   return {
//     type: REQUEST_PODCASTS,
//     page,
//   }
// }

export function selectPage(page = 1) {
  return {
    type: SELECT_PODCASTS_PAGE,
    page
  }
}

export function setSearch(search = '') {
  return {
    type: SET_PODCASTS_SEARCH,
    search
  }
}

function receivePodcasts(search, page, json) {
  return {
    type: RECEIVE_PODCASTS,
    search: search,
    page: page,
    count: json.count,
    items: json.items,
    pagination: json.pagination,
  }
}

export function fetchPodcasts(search = '', page = 1) {
  return dispatch => {
    dispatch(setSearch(search))
    dispatch(selectPage(page))
    return fetch(`/api/podcasts/data/?page=${page}&search=${search}`)
      .then(response => response.json())
      .then(json => dispatch(receivePodcasts(search, page, json)))
  }
}

// export function fetchPostsIfNeeded(reddit) {
//   return (dispatch, getState) => {
//     if (shouldFetchPosts(getState(), reddit)) {
//       return dispatch(fetchPosts(reddit))
//     }
//   }
// }
