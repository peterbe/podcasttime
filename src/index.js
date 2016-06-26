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
import home from './home/reducers'
import podcasts from './podcasts/reducers'
import podcast from './podcast/reducers'

import App from './main/app'
import Home from './home/components'
import Picks from './picks/components'
import Podcasts from './podcasts/components'
import Podcast from './podcast/components'
import { fetchPicks } from './picks/actions'
import { fetchPodcasts } from './podcasts/actions'
import { fetchPodcast } from './podcast/actions'

const loggerMiddleware = createLogger()

const reducer = combineReducers({
  // ...reducers,
  picks,
  home,
  podcasts,
  podcast,
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
  onEnterPicks(nextState, replace)
}


const onEnterPodcasts = (nextState, replace) => {
  let { query } = nextState.location
  let search = nextState.params.search || ''
  let page = query && parseInt(query.page, 10) || 1
  store.dispatch(fetchPodcasts(search, page))
}

const onChangePodcasts = (prevState, nextState, replace) => {
  onEnterPodcasts(nextState, replace)
}


const onEnterPodcast = (nextState, replace) => {
  let id = nextState.params.id
  let slug = nextState.params.slug
  store.dispatch(fetchPodcast(id, slug))
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
            <Route path="podcasts/:id/:slug" component={Podcast}
              onEnter={onEnterPodcast}/>
          </Route>
        </Router>
        {/*<DevTools />*/}
      </div>
    </Provider>
  </IntlProvider>,
  document.getElementById('root')
)
