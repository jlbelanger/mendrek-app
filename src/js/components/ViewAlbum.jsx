import PropTypes from 'prop-types';
import React from 'react';
import API from '../helpers/API';
import Tracks from './Tracks';

export default class ViewAlbum extends React.Component {
	state = {
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
	 * Fetches data.
	 */
	fetch() {
		API.request(`/albums/${this.props.id}`)
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
