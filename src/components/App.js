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
        <Link to="/">Home</Link>
        {' '}
      </header>
      <div>
        <button onClick={() => browserHistory.push('/picks')}>Go to /picks</button>
      </div>
      <div style={{ marginTop: '1.5em' }}>{children}</div>
    </div>
  )
}
