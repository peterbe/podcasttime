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
import { IntlProvider } from 'react-intl';

import picks from './picks/reducers'
import select from './home/reducers'
import podcasts from './podcasts/reducers'

import App from './main/app'
import Home from './home/components'
import Picks from './picks/components'
import Podcasts from './podcasts/components'
import { fetchPicks } from './picks/actions'
import { fetchPodcasts } from './podcasts/actions'

const loggerMiddleware = createLogger()

const reducer = combineReducers({
  // ...reducers,
  picks,
  select,
  podcasts,
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


// XXX see about moving this into picks/components.js towards the bottom
const onEnterPicks = (nextState, replace, callback) => {
  let page = parseInt(nextState.params.page || "1", 10)
  store.dispatch(fetchPicks(page))
  callback()
}
const onEnterPodcasts = (nextState, replace, callback) => {
  let page = parseInt(nextState.params.page || "1", 10)
  store.dispatch(fetchPodcasts(page))
  callback()
}


const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <IntlProvider locale={navigator.language}>
    <Provider store={store}>
      <div>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="picks" component={Picks}
              onEnter={onEnterPicks}/>
            <Route path="picks/:page" component={Picks}
              onEnter={onEnterPicks}/>
            <Route path="podcasts" component={Podcasts}
              onEnter={onEnterPodcasts}/>
            <Route path="podcasts/:page" component={Podcasts}
              onEnter={onEnterPodcasts}/>
          </Route>
        </Router>
        {/*<DevTools />*/}
      </div>
    </Provider>
  </IntlProvider>,
  document.getElementById('root')
)
