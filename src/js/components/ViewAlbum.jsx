import React from 'react';
import Tracks from './Tracks';

export default class ViewAlbum extends React.Component {
  state = {
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
   * @description Fetches data.
   */
  fetch() {
    this.props.request(`/albums/${this.props.match.params.id}`)
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
        <p>Error fetching album.</p>
      );
    }

    if (!this.state.row.id) {
      return null;
    }

    return (
      <div>
        <div className="header">
          <h1>{this.state.row.name}</h1>
        </div>
        <Tracks album={this.state.row} rows={this.state.row.tracks} sortKey="" />
      </div>
    );
  }
}
