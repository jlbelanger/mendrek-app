import React from 'react';
import Search from './Search';
import Tracks from './Tracks';
import API from '../helpers/API';

export default class ViewPlaylist extends React.Component {
  state = {
    filterValue: '',
    row: {},
  };

  /**
   * @description Initializes component.
   */
  componentDidMount() {
    this.fetch();
  }

  /**
   * @description Reinitializes component.
   * @param {Object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetch();
    }
  }

  /**
   * @description Sets the search filter.
   * @param {string} value
   */
  filter = (value) => {
    this.setState({ filterValue: value });
  }

  /**
   * @description Exports a playlist in the given format.
   * @param {Object} e
   */
  export = (e) => {
    const format = e.target.getAttribute('data-format');
    const url = `${API.url()}/playlists/${this.props.match.params.id}.${format}?token=${encodeURIComponent(this.props.api.token)}`;
    window.location.href = url;
  }

  /**
   * @description Fetches data.
   */
  fetch() {
    this.props.request(`/playlists/${this.props.match.params.id}`)
      .then((data) => {
        this.setState({ row: data });
      })
      .catch(() => {
        this.setState({ row: null });
      });
  }

  /**
   * @description Renders the component.
   */
  render() {
    if (this.state.row === null) {
      return (
        <p>Error fetching playlist.</p>
      );
    }

    if (!this.state.row.id) {
      return null;
    }

    const rows = this.state.row.tracks.filter((item) => {
      const filter = this.state.filterValue.toLowerCase();
      return item.name.toLowerCase().indexOf(filter) !== -1;
    });

    return (
      <div>
        <div className="header">
          <h1>{this.state.row.name}</h1>
          <div><button className="button--primary" data-format="csv" type="button" onClick={this.export}>Export CSV</button></div>
          <div><button className="button--primary" data-format="json" type="button" onClick={this.export}>Export JSON</button></div>
        </div>
        <Search filter={this.filter} type="tracks" />
        <Tracks rows={rows} sortKey="" />
      </div>
    );
  }
}
