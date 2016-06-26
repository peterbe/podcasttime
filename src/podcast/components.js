import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { FormattedNumber, FormattedRelative, FormattedDate } from 'react-intl';
import { RippleCentered, FormattedDuration } from '../main/components'
import { updateDocumentTitle } from '../utils'

class Podcast extends Component {
  // static propTypes = {
  //   id: PropTypes.number.isRequired,
  // }

  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.isFetching) {
      updateDocumentTitle('Fetching...')
    } else {
      updateDocumentTitle(this.props.podcast.name)
    }

    return (
      <div className="ui container">
        { this.props.isFetching ?
          <RippleCentered scale={2}/> :
          <div>
            <h1>{ this.props.podcast.name }</h1>
            <AddLinks
              id={this.props.podcast.id}
              />
            <Metadata
              {...this.props.podcast}
              episodeCount={this.props.podcast.episodes_count}
              />
            <Episodes
              episodes={this.props.podcast.episodes}
              />
          </div>
        }
      </div>
    )
  }
}

const AddLinks = ({ id }) => {
  return (
    <div className="ui container">
      <Link to={`/add/${id}`} className="ui button primary">
        I listen to this!
      </Link>
      <Link to="/" className="ui button">
        Go back to Home
      </Link>
    </div>
  )
}

const Metadata = ({
  name,
  thumb,
  total_seconds,
  times_picked,
  last_fetch,
  modified,
  episodeCount,
}) => {
  return (
    <div className="ui segment clearing">
      {
        thumb ?
        <img style={{float: 'left'}} src={thumb.url}/> :
        <img style={{float: 'left'}}
          src="/static/images/no-image.png"
          width="300" height="300"/>
      }
      <div style={{marginLeft: 330}}>
        <h2>Title: { name }</h2>
        <h3>
          Number of episodes:{' '}
          <FormattedNumber value={episodeCount} />
        </h3>
        <h3>
          Total amount of content:{' '}
          <FormattedDuration seconds={total_seconds}/>
        </h3>
        <h3>
          Times picked: <FormattedNumber value={times_picked}/>
        </h3>
        <h3>
          Last updated:{' '}
          { last_fetch ?
            <FormattedRelative value={last_fetch}/> :
            <FormattedRelative value={modified}/>
          }
        </h3>
      </div>
    </div>
  )
}

const Episodes = ({ episodes }) => {
  return (
    <table className="ui celled table">
      <thead>
        <tr>
          <th>Published</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {
          episodes.map((episode) => {
            return <EpisodeRow key={episode.guid} episode={episode}/>
          })
        }
      </tbody>
    </table>
  )
}

const EpisodeRow = ({ episode }) => {
  return (
    <tr>
      <td>
        <FormattedDate value={episode.published}/>{' '}
        <small>
          (<FormattedRelative value={episode.published} />)
        </small>
      </td>
      <td>
        <FormattedDuration seconds={episode.duration} />
      </td>
    </tr>
  )
}

function mapStateToProps(state) {
  // console.log('in mapStateToProps', state.podcasts);
  // console.log('STATE.podcast', state.podcast);
  // return state.podcast
  const {
    isFetching,
    podcast,
  } = state.podcast || {
    true,
    null
  }
  // const { podcastsByPage, selectedPage, search } = state.podcast
  // // const { routing } = state
  // let key = 'p:' + selectedPage + 'search:' + search
  // const {
  //   isFetching,
  //   // lastUpdated,
  //   items,
  //   pagination
  // } = podcastsByPage[key] || {
  //   isFetching: true,
  //   items: [],
  //   pagination: {}
  // }
  // let totalCount = podcastsByPage.count || 0
  // return {
  //   selectedPage,
  //   search,
  //   items,
  //   isFetching,
  //   totalCount,
  //   pagination,
  //   // lastUpdated
  // }
  // console.log('RETURNING', { isFetching, podcast });
  return {
    isFetching,
    podcast,
  }
}

export default connect(mapStateToProps)(Podcast)
