import PropTypes from 'prop-types';
import React from 'react';
import API from '../helpers/API';
import Auth from '../helpers/Auth';
import Search from './Search';
import Tracks from './Tracks';

export default class ViewPlaylist extends React.Component {
	state = {
		filterValue: '',
		row: {},
	};

	static propTypes = {
		id: PropTypes.string.isRequired,
	};

	/**
	 * Initializes component.
	 */
	componentDidMount() {
		this.fetch();
	}

	/**
	 * Reinitializes component.
	 * @param {object} prevProps
	 */
	componentDidUpdate(prevProps) {
		if (prevProps.id !== this.props.id) {
			this.fetch();
		}
	}

	/**
	 * Sets the search filter.
	 * @param {string} value
	 */
	filter = (value) => {
		this.setState({ filterValue: value });
	};

	/**
	 * Exports a playlist in the given format.
	 * @param {object} e
	 */
	export = (e) => {
		const format = e.target.getAttribute('data-format');
		const url = `${API.url()}/playlists/${this.props.id}.${format}?token=${encodeURIComponent(Auth.getToken())}`;
		window.location.href = url;
	};

	/**
	 * Fetches data.
	 */
	fetch() {
		API.request(`/playlists/${this.props.id}`)
			.then((data) => {
				this.setState({ row: data });
			})
			.catch(() => {
				this.setState({ row: null });
			});
	}

	/**
	 * Renders the component.
	 */
	render() {
		if (this.state.row === null) {
			return (
				<p>Error fetching playlist.</p>
			);
		}

		if (!this.state.row.id) {
			return null;
		}

		const rows = this.state.row.tracks.filter((item) => {
			const filter = this.state.filterValue.toLowerCase();
			return item.name.toLowerCase().indexOf(filter) !== -1;
		});

		return (
			<div>
				<div className="header">
					<h1>
						{this.state.row.name}
						<small>{`(${this.state.row.total})`}</small>
					</h1>
					<div><button className="button--primary" data-format="csv" type="button" onClick={this.export}>Export CSV</button></div>
					<div><button className="button--primary" data-format="json" type="button" onClick={this.export}>Export JSON</button></div>
				</div>
				<Search filter={this.filter} type="tracks" />
				<Tracks rows={rows} sortKey="" />
			</div>
		);
	}
}
