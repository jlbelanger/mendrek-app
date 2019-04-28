import React from 'react';
import { Link } from 'react-router-dom';

export default class Tracks extends React.Component {
  state = {
    sortKey: null,
    sortDirection: 'asc',
  };

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
   * @description Renders the component.
   */
  render() {
    if (this.props.rows === null) {
      return null;
    }

    let list;

    if (this.props.rows.length > 0) {
      list = this.props.rows.map((item) => {
        const track = item.track ? item.track : item;
        const album = track.album ? track.album : this.props.album;
        return {
          id: track.id,
          name: track.name,
          artist: track.artists.map(artist => artist.name).join(', '),
          album: album.name,
          album_id: album.id,
          date: album.release_date,
          year: album.release_date ? album.release_date.slice(0, 4) : null,
        };
      });
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
      list = list.map((item) => {
        let albumLink;
        if (item.album) {
          albumLink = (
            <Link className="ellipsis" title={item.album} to={`/albums/${item.album_id}`}>{item.album}</Link>
          );
        }
        return (
          <tr key={item.id}>
            <td><span className="ellipsis" title={item.name}>{item.name}</span></td>
            <td><span className="ellipsis" title={item.artist}>{item.artist}</span></td>
            <td>{albumLink}</td>
            <td>{item.year}</td>
          </tr>
        );
      });
    } else {
      list = (
        <tr>
          <td colSpan="4">No results found.</td>
        </tr>
      );
    }

    const tableClass = `table--sort-${this.state.sortDirection}`;

    return (
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
    );
  }
}
