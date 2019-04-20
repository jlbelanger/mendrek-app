import React from 'react';
import Search from './Search';

export default class Playlists extends React.Component {
  state = {
    filterValue: '',
    rows: [],
  }

  /**
   * @description Fetches data.
   */
  componentDidMount() {
    this.props.request(
      '/me/playlists',
      (response) => {
        this.setState({ rows: response.data });
      },
      () => {
        this.setState({ rows: null });
      },
    );
  }

  /**
   * @description Sets the search filter.
   * @param {string} value
   */
  filter = (value) => {
    this.setState({ filterValue: value });
  }

  /**
   * @description Renders the component.
   */
  render() {
    if (this.state.rows === null) {
      return (
        <p className="no-results">Error fetching playlists.</p>
      );
    }

    if (this.state.rows.length <= 0) {
      return (
        <p className="no-results">No playlists found.</p>
      );
    }

    let list = this.state.rows.items.filter(playlist => (
      playlist.name.toLowerCase().indexOf(this.state.filterValue.toLowerCase()) !== -1
    ));

    if (list.length > 0) {
      list = list.map((playlist) => {
        const buttonClass = this.props.view.type === 'playlist' && this.props.view.id === playlist.id ? 'button--active' : '';
        return (
          <li key={playlist.id}>
            <button className={buttonClass} type="button" onClick={this.props.onClickPlaylist.bind(this, playlist)}>{playlist.name}</button>
          </li>
        );
      });
    } else {
      list = (
        <li className="no-results">No results found.</li>
      );
    }

    return (
      <section>
        <h2>Playlists</h2>
        <Search filter={this.filter} type="playlists" />
        <ul id="playlists">
          {list}
        </ul>
      </section>
    );
  }
}
