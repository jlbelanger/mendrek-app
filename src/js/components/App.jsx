import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import API from '../helpers/API';
import Auth from '../helpers/Auth';
import Cache from '../helpers/Cache';
import Loading from './Loading';
import Playlists from './Playlists';
import Splash from './Splash';
import ViewAlbum from './ViewAlbum';
import ViewArtist from './ViewArtist';
import ViewPlaylist from './ViewPlaylist';

export default class App extends React.Component {
	state = {
		refreshInterval: null,
		user: null,
	}

	/**
	 * Fetches data.
	 */
	componentDidMount() {
		if (!Auth.isLoggedIn()) {
			return;
		}

		API.request('/me')
			.then((user) => {
				this.setState({
					refreshInterval: API.initRefresh(),
					user,
				});
			})
			.catch(() => {
				this.logout();
			});
	}

	/**
	 * Logs out the current user.
	 */
	logout = () => {
		API.request('/authenticate/logout')
			.then(() => {
				Cache.clear();
				clearInterval(this.state.refreshInterval);
				this.setState({
					refreshInterval: null,
					user: null,
				});
			});
	}

	/**
	 * Moves keyboard focus to the main content.
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
	 * Renders the component.
	 */
	render() {
		if (!Auth.isLoggedIn()) {
			return (
				<Splash />
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
							<Playlists />
						</aside>
						<article id="content">
							<Switch>
								<Route path="/albums/:id" render={(props) => <ViewAlbum id={props.match.params.id} />} />
								<Route path="/artists/:id" render={(props) => <ViewArtist id={props.match.params.id} />} />
								<Route path="/playlists/:id" render={(props) => <ViewPlaylist id={props.match.params.id} />} />
							</Switch>
							<Loading />
						</article>
					</main>
				</div>
			</Router>
		);
	}
}
