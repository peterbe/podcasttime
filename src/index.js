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

const onEnterPicks = (nextState, replace) => {
  let { query } = nextState.location
  let page = query && parseInt(query.page, 10) || 1
  store.dispatch(fetchPicks(page))
}

const onChangePicks = (prevState, nextState, replace) => {
  let { query } = nextState.location
  let page = query && parseInt(query.page, 10) || 1
  store.dispatch(fetchPicks(page))
}


const onEnterPodcasts = (nextState, replace) => {
  let { query } = nextState.location
  let search = nextState.params.search || ''
  let page = query && parseInt(query.page, 10) || 1
  // console.log('ONENTER', search, page);
  store.dispatch(fetchPodcasts(search, page))
  // callback()
}

const onChangePodcasts = (prevState, nextState, replace) => {
  let { query } = nextState.location
  let search = nextState.params.search || ''
  let page = query && parseInt(query.page, 10) || 1
  // console.log('ONCHANGE', search, page);
  store.dispatch(fetchPodcasts(search, page))
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
              onEnter={onEnterPicks} onChange={onChangePicks}/>
            <Route path="podcasts" component={Podcasts}
              onEnter={onEnterPodcasts} onChange={onChangePodcasts}/>
            <Route path="podcasts/:search" component={Podcasts}
              onEnter={onEnterPodcasts}  onChange={onChangePodcasts}/>
            <Route path="podcasts/:id/:slug" component={Podcasts}
              onEnter={onEnterPodcasts}  onChange={onChangePodcasts}/>
          </Route>
        </Router>
        {/*<DevTools />*/}
      </div>
    </Provider>
  </IntlProvider>,
  document.getElementById('root')
)
