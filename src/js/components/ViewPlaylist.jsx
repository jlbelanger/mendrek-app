import React from 'react';
import Loading from './Loading';
import Search from './Search';

export default class ViewPlaylist extends React.Component {
  state = {
    filterValue: '',
    row: {},
    sortKey: null,
    sortDirection: 'asc',
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
    if (prevProps.id !== this.props.id) {
      this.fetch();
    }
  }

  /**
   * @description Sorts the table by the given column.
   * @param {string} key
   */
  onClickSort(key) {
    if (this.state.sortKey === key) {
      this.setState((prevState) => {
        const direction = prevState.sortDirection === 'asc' ? 'desc' : 'asc';
        return { sortDirection: direction };
      });
    } else {
      this.setState({ sortKey: key, sortDirection: 'asc' });
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
   * @param {string} format
   */
  export(format) {
    const url = `${this.props.api.url}/playlists/${this.props.id}.${format}?token=${encodeURIComponent(this.props.api.token)}`;
    window.location.href = url;
  }

  /**
   * @description Fetches data.
   */
  fetch() {
    this.props.request(
      `/playlists/${this.props.id}`,
      (response) => {
        this.setState({ row: response.data });
      },
      () => {
        this.setState({ row: null });
      },
    );
  }

  /**
   * @description Renders the component.
   */
  render() {
    if (this.state.row === null) {
      return (
        <article id="content">
          <p>Error fetching playlist.</p>
        </article>
      );
    }

    if (!this.state.row.id) {
      return (
        <article id="content" />
      );
    }

    let list = this.state.row.tracks.items.filter((item) => {
      const filter = this.state.filterValue.toLowerCase();
      return item.track.name.toLowerCase().indexOf(filter) !== -1;
    });

    if (list.length > 0) {
      list = list.map(item => (
        {
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          album: item.track.album.name,
          date: item.track.album.release_date,
          year: item.track.album.release_date ? item.track.album.release_date.slice(0, 4) : null,
        }
      ));
      if (this.state.sortKey) {
        list = list.sort((a, b) => {
          const aVal = a[this.state.sortKey] ? a[this.state.sortKey] : '';
          const bVal = b[this.state.sortKey] ? b[this.state.sortKey] : '';
          if (this.state.sortDirection === 'asc') {
            return aVal.localeCompare(bVal);
          }
          return bVal.localeCompare(aVal);
        });
      }
      list = list.map(item => (
        <tr key={item.id}>
          <td><span className="ellipsis" title={item.name}>{item.name}</span></td>
          <td><span className="ellipsis" title={item.artist}>{item.artist}</span></td>
          <td><span className="ellipsis" title={item.album}>{item.album}</span></td>
          <td>{item.year}</td>
        </tr>
      ));
    } else {
      list = (
        <tr>
          <td colSpan="4">No results found.</td>
        </tr>
      );
    }

    const tableClass = `table--sort-${this.state.sortDirection}`;

    return (
      <article id="content">
        <div className="header">
          <h1>{this.state.row.name}</h1>
          <div><button className="button--primary" type="button" onClick={this.export.bind(this, 'csv')}>Export CSV</button></div>
          <div><button className="button--primary" type="button" onClick={this.export.bind(this, 'json')}>Export JSON</button></div>
        </div>
        <Search filter={this.filter} type="tracks" />
        <table className={tableClass}>
          <thead>
            <tr>
              <th className="heading--name"><button className={this.state.sortKey === 'name' ? 'button--sort' : ''} type="button" onClick={this.onClickSort.bind(this, 'name')}>Name</button></th>
              <th className="heading--artist"><button className={this.state.sortKey === 'artist' ? 'button--sort' : ''} type="button" onClick={this.onClickSort.bind(this, 'artist')}>Artist</button></th>
              <th className="heading--album"><button className={this.state.sortKey === 'album' ? 'button--sort' : ''} type="button" onClick={this.onClickSort.bind(this, 'album')}>Album</button></th>
              <th className="heading--date"><button className={this.state.sortKey === 'date' ? 'button--sort' : ''} type="button" onClick={this.onClickSort.bind(this, 'date')}>Year</button></th>
            </tr>
          </thead>
          <tbody>
            {list}
          </tbody>
        </table>
        <Loading loading={this.props.loading} />
      </article>
    );
  }
}
