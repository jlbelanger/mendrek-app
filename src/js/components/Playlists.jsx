import { Link } from 'react-router-dom';
import React from 'react';
import API from '../helpers/API';
import Search from './Search';

export default class Playlists extends React.Component {
	state = {
		filterValue: '',
		rows: [],
	};

	/**
	 * Fetches data.
	 */
	componentDidMount() {
		API.request('/me/playlists')
			.then((data) => {
				this.setState({ rows: data });
			})
			.catch(() => {
				this.setState({ rows: null });
			});
	}

	/**
	 * Sets the search filter.
	 * @param {string} value
	 */
	filter = (value) => {
		this.setState({ filterValue: value });
	};

	/**
	 * Renders the component.
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

		let list = this.state.rows.filter((playlist) => (
			playlist.name.toLowerCase().indexOf(this.state.filterValue.toLowerCase()) !== -1
		));

		if (list.length > 0) {
			list = list.map((playlist) => {
				let linkClass = 'playlist';
				if (window.location.pathname === `/playlists/${playlist.id}`) {
					linkClass += ' playlist--active';
				}
				return (
					<li key={playlist.id}>
						<Link className={linkClass} to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
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
