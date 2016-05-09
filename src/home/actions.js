import {
  ADD_PODCAST,
  REMOVE_PODCAST,
  REMOVE_ALL_PODCASTS,
 } from './constants'


export function addPodcast(podcast) {
  return {
    type: ADD_PODCAST,
    podcast: podcast
  }
}

export function removePodcast(podcast) {
  return {
    type: REMOVE_PODCAST,
    podcast: podcast
  }
}

export function removeAllPodcasts(podcast) {
  return {
    type: REMOVE_ALL_PODCASTS,
  }
}
