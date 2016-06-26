import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import {
  selectPage,
  requestPicks,
  fetchPicks,
} from '../picks/actions'
import { podcastURL, updateDocumentTitle } from '../utils'
import { RippleCentered } from '../main/components'


class Home extends Component {
  static propTypes = {
    selectedPage: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    // lastUpdated: PropTypes.number,
  }

  constructor(props) {
    super(props)
  }

  render() {
    updateDocumentTitle('Picks')
    const { isFetching, selectedPage, items, pagination } = this.props
    return (
      <div className="ui container">
        <h2>Picks - Page {this.props.selectedPage}</h2>
          { this.props.isFetching ? <RippleCentered scale={2}/> :
            <div>
              {
                items.map((pick) => {
                  return <Pick key={pick.id} pick={pick}/>
                })
              }
              <Pagination
                pagination={this.props.pagination}/>
            </div>
          }
      </div>
    )
  }
}

const Pick = ({pick}) => {
  // XXX stop using style tags
  return (
    <div
      className="ui eight cards segment"
      style={{marginBottom:5}}>
      {
        pick.podcasts.map(podcast => <Podcast key={podcast.id} podcast={podcast}/>)
      }
    </div>
  )
}

const Podcast = ({podcast}) => {
  let linkURL = `/podcasts/${podcast.id}/${podcast.slug}`
  return (
    <div
      className="ui centered card"
      title={podcast.name}>
      <Link className="image" to={linkURL}>
        {
          podcast.image ?
          <img src={podcast.image}/> :
          <img src="/static/podcasttime/images/no-image.png"/>
         }
         <span className="floating ui teal label" title="Times picked">
           {podcast.times_picked}
         </span>
      </Link>
    </div>
  )
}


const Pagination = ({ pagination }) => {

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
    nextLink = (
      <Link className="item" to={{
          pathname: '/picks',
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
    prevLink = (
      <Link className="item" to={{
          pathname: '/picks',
          query: { page: pagination.previous_page_number },
        }}>
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
}


function mapStateToProps(state) {
  const { picksByPage, selectedPage } = state.picks
  const {
    isFetching,
    // lastUpdated,
    items,
    pagination
  } = picksByPage[selectedPage] || {
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
