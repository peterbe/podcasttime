import React, { Component } from 'react';
// import $ from 'jquery';

export default class Home extends Component {
  render() {
    return (
      <div className="ui text container">
        <h1>How Much Time Do <i>Your</i> Podcasts Take To Listen To?</h1>
        <MainSearch/>
      </div>
    );
  }
}


class MainSearch extends Component {

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
    .on("select2:select", function (event) {
      store.dispatch({
        type: 'PODCAST',
        data: event.params.data
      });
      // addSelectedPodcast(event.params.data);
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
