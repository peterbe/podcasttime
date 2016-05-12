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

  // componentDidMount() {
  //   const { dispatch, selectedPage } = this.props
  //   let page = parseInt(this.props.params.page || "1")
  //   // console.log('Here in Picks.Picks.componentDidMount', page);
  //   // console.log('PAGE:', page, 'SELECTEDPAGE', selectedPage);
  //   // dispatch(selectPage(page))
  //   // dispatch(fetchPicks(page))
  //   // dispatch()
  // }

  handlePageChange(event, page) {
    event.preventDefault()

    // XXX Use <Link> instead in the JSX render
    if (page > 1) {
      browserHistory.push(`/picks/${page}`)
    } else {
      browserHistory.push(`/picks`)
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
      <div className="ui container">
        <h2>Picks - Page {this.props.selectedPage}</h2>
        {
          items.map((pick) => {
            return <Pick key={pick.id} pick={pick}/>
          })
        }
        <Pagination
          handlePageChange={this.handlePageChange}
          pagination={pagination}/>
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
  const handlePocastClick = (event, podcast) => {
    event.preventDefault()
    // selectPodcastID()
    browserHistory.push(podcastURL(podcast))
    // console.log(podcastURL(podcast))
  }

  return (
    <div
      className="ui centered card"
      title={podcast.name}>
      <a className="image" href={podcastURL(podcast)}
        onClick={(event) => handlePocastClick(event, podcast)}>
        {
          podcast.image ?
          <img src={podcast.image}/> :
          <img src="/static/podcasttime/images/no-image.png"/>
         }
         <span className="floating ui teal label" title="Times picked">
           {podcast.times_picked}
         </span>

      </a>
    </div>
  )
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
