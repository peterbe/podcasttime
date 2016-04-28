import { ADD_PODCAST_ID, REMOVE_PODCAST_ID } from '../constants'

export function addPodcastId(id) {
  return {
    type: ADD_PODCAST_ID,
    id: id
  }
}

export function removePodcastId(id) {
  return {
    type: REMOVE_PODCAST_ID,
    id: id
  }
}
