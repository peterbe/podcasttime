import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  selectPage,
  requestPicks,
  fetchPicks,
} from '../actions/picks'
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
    // console.log("CONSTRUCTOR PICKS.HOME", props);
    console.log("IN constructor", props);
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedPage } = this.props
    let page = parseInt(this.props.params.page || "1")
    console.log('PAGE:', page, 'SELECTEDPAGE', selectedPage);
    dispatch(selectPage(page))
    dispatch(fetchPicks(selectedPage))
    // dispatch()
  }

  handlePageChange(page) {
    // this.props.dispatch(selectedPage({page: }))
    this.props.dispatch(fetchPicks(page))
  }
  // console.log('PICKS...');
  // console.log(picks);
  // console.log('AFTER3');
  // XXX Need a solution of not having to repeat the metadata too much
  // picks.isFetching??
  render() {
    // {
    //   picks.items.map((pick) => {
    //     return <Pick pick={pick}/>
    //   })
    // }
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

const Pagination = ({pagination, handlePageChange}) => {
  return (
    <div className="ui two column centered grid" style={{marginTop: 100}}>
      <div className="ui pagination menu">
        {
          pagination.has_previous ?
          <a className="item" href={picksURL(pagination.previous_page_number)}
            onClick={() => handlePageChange(pagination.previous_page_number)}>
            &larr; Page {pagination.previous_page_number}
          </a>
          :
          null
        }
        <a className="item disabled">
          Page {pagination.number} of {pagination.num_pages}
        </a>
        {
          pagination.has_next ?
          <a className="item" href={picksURL(pagination.next_page_number)}
            onClick={() => handlePageChange(pagination.next_page_number)}>
            Page {pagination.next_page_number} &rarr;
          </a>
          :
          <a className="item disabled">
            Page {pagination.num_pages}
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
  return (
    <div
      className="ui centered card"
      title="{podcast.title}">
      <a className="image" href={podcastURL(podcast)}>
        {
          podcast.image ?
          <img src={podcast.image}/> :
          <img src="/static/podcasttime/images/no-image.png"/>
         }
      </a>
      <div className="floating ui teal label" title="Times picked">
        {podcast.times_picked}
      </div>
    </div>
  )
}


function mapStateToProps(state) {
  // const { picksRootReducer } = state
  console.log("STATATE", state);
  const { picksByPage, selectedPage } = state.picksRootReducer
  console.log('picksRootReducer', state.picksRootReducer);
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
