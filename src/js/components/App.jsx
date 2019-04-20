import React from 'react';
import API from '../helpers/API';
import Cache from '../helpers/Cache';
import Playlists from './Playlists';
import Splash from './Splash';
import ViewPlaylist from './ViewPlaylist';

export default class App extends React.Component {
  state = this.getInitialState()

  /**
   * @description Returns the initial state.
   */
  getInitialState() {
    return {
      api: new API(),
      loading: 0,
      view: {
        id: null,
        type: null,
      },
      user: null,
    };
  }

  /**
   * @description Fetches data.
   */
  componentDidMount() {
    this.request(
      '/me',
      (response) => {
        this.setState({ user: response.data });
      },
      () => {
        this.logout();
      },
    );
  }

  /**
   * @description Makes a request to the API.
   * @param {string} endpoint
   * @param {function} successCallback
   * @param {function} errorCallback
   */
  request = (endpoint, successCallback, errorCallback) => {
    this.setState(prevState => ({ loading: prevState.loading + 1 }));
    this.state.api.request(
      endpoint,
      (response) => {
        this.setState(prevState => ({ loading: prevState.loading - 1 }));
        if (response.success) {
          successCallback(response);
        } else {
          errorCallback(response);
        }
      },
    );
  }

  /**
   * @description Loads the given playlist.
   * @param {Object} playlist
   */
  onClickPlaylist = (playlist) => {
    this.setState({ view: { id: playlist.id, type: 'playlist' } });
  }

  /**
   * @description Logs out the current user.
   */
  logout = () => {
    Cache.clear();
    this.setState(this.getInitialState());
  }

  /**
   * @description Moves keyboard focus to the main content.
   */
  skip = () => {
    const elem = document.getElementById('content');
    elem.setAttribute('tabindex', -1);
    elem.addEventListener('blur', () => {
      elem.removeAttribute('tabindex');
    });
    elem.focus();
  }

  /**
   * @description Renders the component.
   */
  render() {
    if (!this.state.api.token) {
      return (
        <Splash url={this.state.api.url} />
      );
    }

    if (!this.state.user) {
      return null;
    }

    let content = null;
    if (this.state.view.type === 'playlist') {
      content = (
        <ViewPlaylist
          api={this.state.api}
          id={this.state.view.id}
          loading={this.state.loading}
          request={this.request}
        />
      );
    }

    return (
      <div id="container">
        <main id="main">
          <a href="#content" id="skip" onClick={this.skip}>Skip to content</a>
          <aside id="sidebar">
            <h1 id="title">Mendrek</h1>
            <ul id="nav">
              <li>{this.state.user.id}</li>
              <li><button type="button" onClick={this.logout}>Logout</button></li>
            </ul>
            <Playlists
              request={this.request}
              onClickPlaylist={this.onClickPlaylist}
              view={this.state.view}
            />
          </aside>
          {content}
        </main>
      </div>
    );
  }
}
