import {
  ADD_PODCAST,
  REMOVE_PODCAST,
  REMOVE_ALL_PODCASTS,
} from '../constants'

const initialState = {
  podcasts: []
}

export default function update(state = initialState.podcasts, action) {
  if (action.type === ADD_PODCAST) {
    return [action.podcast, ...state];
  } else if (action.type === REMOVE_PODCAST) {
    return state.filter(podcast => podcast.id !== action.podcast.id);
  } else if (action.type === REMOVE_ALL_PODCASTS) {
    return [];
  }
  return state
}
