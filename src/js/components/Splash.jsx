import React from 'react';
import API from '../helpers/API';

export default class Splash extends React.Component {
	/**
	 * Redirects the user to Spotify for authentication.
	 */
	login = () => { // eslint-disable-line class-methods-use-this
		window.location.assign(`${API.url()}/authenticate`);
	};

	/**
	 * Renders the component.
	 */
	render() {
		return (
			<main id="splash">
				<h1 id="title">Mendrek</h1>
				<p>Mendrek lets you do magical things with Spotify, like:</p>
				<ul>
					<li>Export playlists</li>
				</ul>
				<p>Yeah, that&rsquo;s about it right now. Sorry.</p>
				<p><button className="button--primary" type="button" onClick={this.login}>Login with Spotify</button></p>
			</main>
		);
	}
}
