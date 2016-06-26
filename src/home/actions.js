import {
  ADD_PODCASTS,
  REMOVE_PODCAST,
  REMOVE_ALL_PODCASTS,
 } from './constants'

export function addPodcasts(podcasts) {
  return {
    type: ADD_PODCASTS,
    podcasts: podcasts
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
