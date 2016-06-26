import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import {
  addPodcasts,
  removePodcast,
  removeAllPodcasts,
} from '../home/actions'
import { updateDocumentTitle } from '../utils'


// class Home({ podcasts, addPodcast, removePodcast, removeAllPodcasts }) extends Component {
class Home extends Component {
  static propTypes = {
    podcasts: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    // this.selectPodcast = this.selectPodcast.bind(this)
    // console.log('PROPS', props);
    // console.log('CONSTRUCTOR', props.podcasts);
  }

  componentDidMount() {
    // If you arrived on the page with a ?ids=123,456 let's load those
    // almost just as if the user had selected them.
    // But be careful, if you come from a popState where you already
    // have these loaded, then don't bother.
    if (this.props.location.query.picks) {
      let ids = this.props.location.query.picks.split(',').map(x=>parseInt(x))
      // now remove the ones we have already loaded
      let existingIds = this.props.podcasts.map(p=>p.id)
      ids = ids.filter(x => existingIds.indexOf(x) === -1)
      // the home page was loaded with picks
      if (ids.length) {
        fetch(`/api/find?ids=${this.props.location.query.picks}`)
        .then(response => response.json())
        .then(json => {
          this.props.addPodcasts(json.items)
        })
      }
    }
  }

  /* Used to make a permalink to this set of picks */
  _updateBrowserHistory(ids) {
    if (ids.length) {
      browserHistory.push(`/?picks=${ids}`)
    } else {
      browserHistory.push(`/`)
    }

  }

  selectPodcast(podcast) {
    this.props.addPodcasts([podcast])
    let ids = this.props.podcasts.map(p => p.id)
    this._updateBrowserHistory(ids)
  }

  unselectPodcast(podcast) {
    this.props.removePodcast(podcast)
    let ids = this.props.podcasts.map(p => p.id)
    ids = ids.filter(id => id !== podcast.id)
    this._updateBrowserHistory(ids)
  }

  render() {
    updateDocumentTitle()  // default

    return (
      <div className="ui text container">
        <h1>How Much Time Do <i>Your</i> Podcasts Take To Listen To?</h1>
        <MainSearch
          selectPodcast={(podcast) => this.selectPodcast(podcast)}
          />
        <Podcasts
          podcasts={this.props.podcasts}
          removePodcast={(podcast) => this.unselectPodcast(podcast)}
          removeAllPodcasts={this.props.removeAllPodcasts}
          />
      </div>
    )
  }

}

const Podcasts = ({podcasts, removePodcast, removeAllPodcasts}) => {
  // XXX instead of style we should set a classname that'll animate it
  // in as a fade
  let style = {};
  if (podcasts.length) {
    style.display = 'block';
  }
  return (
    <div className="selected" style={style}>
      <h3><i>Your</i> Podcasts...</h3>
      <div className="your-podcasts">
        {
          podcasts.map((podcast) => {
            return <Podcast
              key={podcast.id}
              podcast={podcast}
              removePodcast={() => removePodcast(podcast)}/>
          })
        }
      </div>
      <div className="remove-all">
        <button
          type="button"
          className="button ui remove-all"
          title="And start over..."
          onClick={removeAllPodcasts}>Remove All</button>
      </div>
    </div>
  )
}

const Podcast = ({podcast, removePodcast}) => {
  let text = podcast.episodes + ' episodes';
  if (podcast.hours !== null) {
    // XXX template?
    text += ', about ' + parseInt(podcast.hours, 10) + ' hours';
  }
  return (
    <div className="clearfix podcast">
      <div className="actions">
        <button
          type="button"
          className="ui button"
          onClick={removePodcast}
          >Remove</button>
      </div>
      <div className="img">
        <Link title={podcast.name}
          to={`/podcasts/${podcast.id}/${podcast.slug}`}>
          <img src={podcast.image_url} alt="logo"/>
        </Link>
      </div>
      <div className="meta">
        <h3>
          <Link title={podcast.name}
            to={`/podcasts/${podcast.id}/${podcast.slug}`}>
            {podcast.name}
          </Link>
        </h3>
        <p>
          { text }
        </p>
      </div>
    </div>
  )
}



class MainSearch extends React.Component {

  formatPodcast(podcast) {
    if (podcast.loading) return podcast.name;

    var image_url = podcast.image_url;
    if (image_url === null) {
      image_url = '/static/images/no-image.png';
    }
    var markup = "<div class='select2-result-podcast clearfix'>" +
      "<div class='select2-result-podcast__avatar'><img src='" + image_url + "' /></div>" +
      "<div class='select2-result-podcast__meta'>" +
        "<div class='select2-result-podcast__title'>" + podcast.name + "</div>";
    markup += "<div class='select2-result-podcast__description'>";
    markup += podcast.episodes + " episodes";
    if (podcast.hours !== null) {
      markup += ", about " + parseInt(podcast.hours, 10) + " total hours.";
    }
    markup += "</div>";
    markup += "</div></div>";
    return markup;
  }

  formatPodcastSelection(item) {
    return item.name || item.text;
  }

  componentDidMount() {
    $('select[name="name"]').select2({
      ajax: {
        url: "/api/find",
        dataType: 'json',
        delay: 150,
        data: (params) => {
          return {
            q: params.term, // search term
            page: params.page,
          };
        },
        processResults: (data, params) => {
          // parse the results into the format expected by Select2
          // since we are using custom formatting functions we do not need to
          // alter the remote JSON data, except to indicate that infinite
          // scrolling can be used
          params.page = params.page || 1;

          if (params.term.length >= 3) {
            // XXX use react state here (or store.dispatch())
            $('.link-to-discover:hidden').fadeIn(600);
            var link = $('.link-to-discover a');
            if (!link.data('href')) {
              link.data('href', link.attr('href'));
            }
            link.attr(
              'href',
              link.data('href') + '?search=' + encodeURIComponent(params.term)
            );
          }

          return {
            results: data.items,
            pagination: {
              more: (params.page * 30) < data.total_count
            }
          };
        },
        cache: true,
      },
      escapeMarkup: (markup) => {
        return markup; // let our custom formatter work
      },
      minimumInputLength: 1,
      templateResult: this.formatPodcast,
      templateSelection: this.formatPodcastSelection,
    })
    .on("select2:select", (event) => {
      // browserHistory.push(`/?picks=${event.params.data.id}`)
      this.props.selectPodcast(event.params.data);
    });
  }

  render() {
    return (
      <form>
        <select name="name">
          <option value="">Type here to find the podcasts you listen to</option>
        </select>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { podcasts: state.home }
}

export default connect(mapStateToProps, {
  addPodcasts,
  removePodcast,
  removeAllPodcasts,
})(Home)
