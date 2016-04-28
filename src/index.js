import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import * as reducers from './reducers'
// import { App, Home, Foo, Bar } from './components'
import { App, Home, Picks } from './components'

const loggerMiddleware = createLogger()

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

// const DevTools = createDevTools(
//   <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
//     <LogMonitor theme="tomorrow" preserveScrollTop={false} />
//   </DockMonitor>
// )
const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware,
  ),
  // DevTools.instrument()
)


const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="picks" component={Picks}/>
          <Route path="picks/:page" component={Picks}/>
          {/*<Route path="bar" component={Bar}/>*/}
        </Route>
      </Router>
      {/*<DevTools />*/}
    </div>
  </Provider>,
  document.getElementById('root')
)
