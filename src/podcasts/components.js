import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { FormattedNumber, FormattedPlural, FormattedRelative } from 'react-intl';
import {
  podcastURL,
  picksURL,
  updateDocumentTitle,
} from '../utils'
import { RippleCentered } from '../main/components'


class Podcasts extends Component {
  static propTypes = {
    selectedPage: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    totalCount: PropTypes.number.isRequired,
    // lastUpdated: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.submitSearch = this.submitSearch.bind(this)
  }

  submitSearch(term) {
    if (term) {
      browserHistory.push(`/podcasts/${term}`)
    } else {
      browserHistory.push(`/podcasts`)
    }
  }

  render() {
    let title = 'Podcasts'
    if (this.props.search && this.props.selectedPage > 1) {
      title += ` ("${this.props.search}", page ${this.props.selectedPage})`
    } else if (this.props.search) {
      title += ` ("${this.props.search}")`
    } else if (this.props.selectedPage > 1) {
      title += ` (page ${this.props.selectedPage})`
    }
    updateDocumentTitle(title)

    return (
      <div className="ui container">
        <SearchForm
          onSubmit={this.submitSearch}
          search={this.props.search}/>

        <h5 className="ui right aligned header">
          {/* Consider adding a link there class "Clear" after 'found.' */}
          Page{' '}{ this.props.selectedPage }
          {' - '}
          {
            !this.props.isFetching ?
            <span><FormattedNumber value={this.props.totalCount} /> podcasts found.</span> :
            <i>loading...</i>
          }
        </h5>

        { this.props.isFetching ? <RippleCentered scale={2}/> :
          <div>
            <div className="ui link cards">
              {
                this.props.items.map((podcast) => {
                  return <PodcastCard key={podcast.id} podcast={podcast}/>
                })
              }
            </div>
            <Pagination
              search={this.props.search}
              pagination={this.props.pagination}/>
          </div>
        }
      </div>
    )
  }
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this._onSubmit = this._onSubmit.bind(this)
  }

  _onSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.refs.q.value.trim())
  }

  render() {
    return (
      <form action="." className="ui search" onSubmit={this._onSubmit}
        style={{marginBottom: 30}}>
        <div className="ui fluid huge icon input">
          <input
            type="text"
            ref="q"
            name="search"
            placeholder="Search..."
            defaultValue={this.props.search} />
          <i className="search icon"></i>
        </div>
      </form>
    )
  }
}

const PodcastCard = ({podcast}) => {
  let updateDate = podcast.last_fetch ? podcast.last_fetch : podcast.modified
  return (
    <div className="ui centered card">
      <Link to={podcastURL(podcast)} className="image">
        {
          podcast.image ?
          <img src={podcast.image}/> :
          <img src="/static/images/no-image.png"/>
         }
      </Link>

      <div className="content">
        <Link to={podcastURL(podcast)} className="header">
          {podcast.name}
        </Link>
        <div className="meta">
          <span className="date">
            Last updated <FormattedRelative value={updateDate} />
          </span>
        </div>
        <div className="description">
          <PodcastDescription
            episodeCount={podcast.episode_count}
            episodeHours={Math.ceil(podcast.episode_seconds / 3600)}
            />
        </div>
      </div>

      <div className="extra content">
        <a>
          Picked <b><FormattedNumber value={podcast.times_picked}/></b> {' '}
          <FormattedPlural
            value={podcast.times_picked}
            one="time"
            other="times"
          />
        </a>
      </div>

    </div>
  )
}
PodcastCard.propTypes = {
  podcast: PropTypes.object.isRequired,
}

const PodcastDescription = ({ episodeCount, episodeHours}) => {
  if (episodeCount) {
    return (
      <span>
        <b><FormattedNumber value={episodeCount} /></b> episodes,{' '}
        <b><FormattedNumber value={episodeHours} /></b> hours of content.
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

const Pagination = ({
  pagination,
  search,
}) => {

  const prev = (page) => {
    return `← Page ${page}`
  }

  const next = (page) => {
    return `Page ${page} →`
  }

  const current = (number, pages) => {
    return `Page ${number} or ${pages}`
  }

  let nextLink = null
  if (pagination.has_next) {
    let nextURL = '/podcasts'
    if (search) {
      nextURL += '/' + search
    }
    // nextURL += '/p' + pagination.next_page_number
    nextLink = (
      <Link className="item" to={{
          pathname: nextURL,
          query: { page: pagination.next_page_number },
        }}>
        {next(pagination.next_page_number)}
      </Link>
    )
  } else {
    nextLink = (
      <a className="item disabled">
        Page{' '}{pagination.num_pages}
      </a>
    )
  }

  let prevLink = null
  if (pagination.has_previous) {
    let prevURL = '/podcasts'
    if (search) {
      prevURL += '/' + search
    }
    prevLink = (
      <Link to={{
          pathname: prevURL,
          query: { page: pagination.previous_page_number },
        }} className="item">
        {prev(pagination.previous_page_number)}
      </Link>
    )
  } else {
    prevLink = (
      <a className="item disabled">
        Page 1
      </a>
    )
  }

  return (
    <div className="ui two column centered grid" style={{marginTop: 100}}>
      <div className="ui pagination menu">
        { prevLink }
        <a className="item disabled">
          {current(pagination.number, pagination.num_pages)}
        </a>
        { nextLink }
      </div>
    </div>
  )
}
Pagination.propTypes = {
  pagination: PropTypes.object.isRequired,
  search: PropTypes.string,
}


function mapStateToProps(state) {
  const { podcastsByPage, selectedPage, search } = state.podcasts
  let key = 'p:' + selectedPage + 'search:' + search
  const {
    isFetching,
    // lastUpdated,
    items,
    pagination
  } = podcastsByPage[key] || {
    isFetching: true,
    items: [],
    pagination: {}
  }
  let totalCount = podcastsByPage.count || 0
  return {
    selectedPage,
    search,
    items,
    isFetching,
    totalCount,
    pagination,
    // lastUpdated
  }
}

export default connect(mapStateToProps)(Podcasts)
