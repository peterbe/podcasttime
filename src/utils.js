export const podcastURL = (podcast) => {
  return `/podcasts/${podcast.id}/${podcast.slug}`
}

export const picksURL = (page = 1) => {
  if (page === 1) {
    return `/picks`
  }
  return `/picks/${page}`
}
