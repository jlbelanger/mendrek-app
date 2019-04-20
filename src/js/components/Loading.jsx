import React from 'react';

export default class Loading extends React.Component {
  /**
   * @description Returns true if waiting for requests to finish.
   */
  isLoading() {
    return this.props.loading > 0;
  }

  /**
   * @description Renders the component.
   */
  render() {
    if (!this.isLoading()) {
      return null;
    }

    return (
      <div id="spinner">Loading</div>
    );
  }
}
