import 'whatwg-fetch'


import {
  RECEIVE_PODCAST,
  REQUEST_PODCAST,
 } from './constants'


 function receivePodcast(json) {
   return {
     type: RECEIVE_PODCAST,
     podcast: json,
   }
 }

 function requestPodcast(id, slug) {
   return {
     type: REQUEST_PODCAST,
     id: id,
     slug: slug,
   }
 }


export function fetchPodcast(id, slug) {
  return dispatch => {
    dispatch(requestPodcast(id, slug))
    return fetch(`/api/podcasts/data/${id}/${slug}`)
      .then(response => response.json())
      .then(json => dispatch(receivePodcast(json)))
  }
}
