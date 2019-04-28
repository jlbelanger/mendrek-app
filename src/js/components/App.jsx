import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import API from '../helpers/API';
import Cache from '../helpers/Cache';
import Loading from './Loading';
import Playlists from './Playlists';
import Splash from './Splash';
import ViewAlbum from './ViewAlbum';
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
      user: null,
    };
  }

  /**
   * @description Fetches data.
   */
  componentDidMount() {
    this.request('/me')
      .then((data) => {
        this.setState({ user: data });
      })
      .catch(() => {
        this.logout();
      });
  }

  /**
   * @description Makes a request to the API.
   * @param {string} endpoint
   * @returns {Promise}
   */
  request = (endpoint) => {
    this.setState(prevState => ({ loading: prevState.loading + 1 }));
    return this.state.api.request(endpoint)
      .finally(() => {
        this.setState(prevState => ({ loading: prevState.loading - 1 }));
      });
  }

  /**
   * @description Logs out the current user.
   */
  logout = () => {
    this.request('/authenticate/logout')
      .catch(() => null)
      .then(() => {
        Cache.clear();
        clearInterval(this.state.api.refreshInterval);
        this.setState(this.getInitialState());
      });
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

    return (
      <Router>
        <div id="container">
          <main id="main">
            <a href="#content" id="skip" onClick={this.skip}>Skip to content</a>
            <aside id="sidebar">
              <h1 id="title">Mendrek</h1>
              <ul id="nav">
                <li>{this.state.user.id}</li>
                <li><button type="button" onClick={this.logout}>Logout</button></li>
              </ul>
              <Playlists request={this.request} />
            </aside>
            <article id="content">
              <Switch>
                <Route path="/albums/:id" render={props => <ViewAlbum {...props} request={this.request} />} />
                <Route path="/playlists/:id" render={props => <ViewPlaylist {...props} api={this.state.api} request={this.request} />} />
              </Switch>
              <Loading loading={this.state.loading} />
            </article>
          </main>
        </div>
      </Router>
    );
  }
}
