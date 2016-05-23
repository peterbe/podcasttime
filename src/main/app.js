import React from 'react'
import { Link, browserHistory } from 'react-router'

export default function App({ children }) {
  // return (
  //   <div>
  //     Hi
  //   </div>
  // )
  return (
    <div>
      <header>
        Links:
        {' '}
        <Link to="/" activeClassName="active">Home</Link>
        {' '}
        <Link to="/podcasts" activeClassName="active">Podcasts</Link>
        {' '}
        <Link to="/picks" activeClassName="active">Picks</Link>
        {' '}
      </header>
      <div className="ui main container" style={{ marginTop: '1.5em' }}>{children}</div>
    </div>
  )
}
