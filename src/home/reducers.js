import {
  ADD_PODCASTS,
  REMOVE_PODCAST,
  REMOVE_ALL_PODCASTS,
} from './constants'

const initialState = {
  podcasts: []
}

export default function home(state = initialState.podcasts, action) {
  if (action.type === ADD_PODCASTS) {
    return action.podcasts.concat(state)
  } else if (action.type === REMOVE_PODCAST) {
    return state.filter(podcast => podcast.id !== action.podcast.id)
  } else if (action.type === REMOVE_ALL_PODCASTS) {
    return []
  }
  return state
}
