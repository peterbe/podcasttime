import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import {
  selectPage,
  requestPicks,
  fetchPicks,
} from '../picks/actions'
import { podcastURL, picksURL } from '../utils'


class Home extends Component {
  static propTypes = {
    selectedPage: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    // lastUpdated: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange(event, page) {
    event.preventDefault()

    // XXX Use <Link> instead in the JSX render
    if (page > 1) {
      browserHistory.push(`/podcasts/${page}`)
    } else {
      browserHistory.push(`/podcasts`)
    }
    // this.props.dispatch(fetchPicks(page))
    // this.props.dispatch(selectPage(page))
  }

  render() {
    const { isFetching, selectedPage, items, pagination } = this.props
    if (isFetching) {
      return (
        <div className="ui text container">
          Fetching.... fetching... fetching...
        </div>
      )
    }
    return (
      <div className="ui text container">
        <h5 className="ui right aligned header">
          { this.props.count } podcasts found.
        </h5>
        <form>form here</form>
        {/*<h2>Podcasts - Page {this.props.selectedPage}</h2>*/}
        <div className="ui link cards">
          {
            items.map((podcast) => {
              return <Podcast key={podcast.id} podcast={podcast}/>
            })
          }
        </div>

        <Pagination
          handlePageChange={this.handlePageChange}
          pagination={pagination}/>
      </div>
    )
  }
}


const Podcast = ({podcast}) => {
  const handlePocastClick = (event, podcast) => {
    event.preventDefault()
    // selectPodcastID()
    browserHistory.push(podcastURL(podcast))
    // console.log(podcastURL(podcast))
  }

  return (
    <div className="ui centered card">
      <a className="image" href={podcastURL(podcast)}
        onClick={(event) => handlePocastClick(event, podcast)}>
        {
          podcast.image ?
          <img src={podcast.image}/> :
          <img src="/static/images/no-image.png"/>
         }
      </a>

      <div className="content">
        <a className="image" href={podcastURL(podcast)}
          onClick={(event) => handlePocastClick(event, podcast)}>
          {podcast.name}
        </a>
        <div className="meta">
          <span className="date">
            Last updated {podcast.last_fetch ? podcast.last_fetch : podcast.modified } ago
          </span>
        </div>
      </div>
      <div className="description">
        <PodcastDescription
          episodeCount={podcast.episode_count}
          episodeHours={podcast.episode_hours}
          />
      </div>
      <div className="extra content">
        <a>
          Picked <b>{podcast.times_picked}</b> times
        </a>
      </div>

    </div>
  )
}
Podcast.propTypes = {
  podcast: PropTypes.object.isRequired,
}

const PodcastDescription = ({ episodeCount, episodeHours}) => {
  if (episodeCount) {
    return (
      <span>
        <b>{episodeCount}</b> episodes, <b>{episodeHours}</b> hours of content.
      </span>
    )
  } else {
    return <i>episodes currently unknown</i>
  }
}
PodcastDescription.propTypes = {
  episodeCount: PropTypes.number.isRequired,
  episodeHours: PropTypes.number.isRequired,
}

const Pagination = ({pagination, handlePageChange}) => {

  const prev = (page) => {
    return `← Page ${page}`
  }

  const next = (page) => {
    return `Page ${page} →`
  }

  const current = (number, pages) => {
    return `Page ${number} or ${pages}`
  }

  return (
    <div className="ui two column centered grid" style={{marginTop: 100}}>
      <div className="ui pagination menu">
        {
          pagination.has_previous ?
          <a className="item" href={picksURL(pagination.previous_page_number)}
            onClick={(event) => handlePageChange(event, pagination.previous_page_number)}>
            {prev(pagination.previous_page_number)}
          </a>
          :
          null
        }
        <a className="item disabled">
          {current(pagination.number, pagination.num_pages)}
        </a>
        {
          pagination.has_next ?
          <a className="item" href={picksURL(pagination.next_page_number)}
            onClick={(event) => handlePageChange(event, pagination.next_page_number)}>
            {next(pagination.next_page_number)}
          </a>
          :
          <a className="item disabled">
            Page{' '}{pagination.num_pages}
          </a>
        }
      </div>
    </div>
  )
}
Pagination.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
}


function mapStateToProps(state) {
  const { podcastsByPage, selectedPage } = state.podcasts
  const {
    isFetching,
    // lastUpdated,
    items,
    pagination
  } = podcastsByPage[selectedPage] || {
    isFetching: true,
    items: [],
    pagination: {}
  }

  return {
    selectedPage,
    items,
    isFetching,
    pagination,
    // lastUpdated
  }
}

export default connect(mapStateToProps)(Home)
