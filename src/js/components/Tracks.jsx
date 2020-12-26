import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

export default class Tracks extends React.Component {
	static propTypes = {
		album: PropTypes.object,
		rows: PropTypes.array.isRequired,
	}

	static defaultProps = {
		album: null,
	}

	constructor(props) {
		super(props);
		this.state = this.getInitialState(props); // eslint-disable-line react/state-in-constructor
	}

	/**
	 * Returns the initial state.
	 * @param {object} props
	 */
	getInitialState(props) {
		return {
			sortKey: props && props.sortKey ? props.sortKey : null,
			sortDirection: 'asc',
		};
	}

	/**
	 * Reinitializes component.
	 * @param {object} newProps
	 */
	UNSAFE_componentWillReceiveProps(newProps) { // eslint-disable-line camelcase
		if (newProps.rows !== this.props.rows) {
			this.setState(this.getInitialState(newProps));
		}
	}

	/**
	 * Sorts the table by the given column.
	 * @param {object} e
	 */
	onClickSort = (e) => {
		const key = e.target.getAttribute('data-key');
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
	 * Renders the component.
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
					artist: track.artists.map((artist) => artist.name).join(', '),
					artists: track.artists,
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
						<Link title={item.album} to={`/albums/${item.album_id}`}>{item.album}</Link>
					);
				}

				let artistLinks;
				if (item.artists) {
					artistLinks = item.artists.map((artist) => (
						<li key={artist.id}>
							<Link title={artist.name} to={`/artists/${artist.id}`}>{artist.name}</Link>
						</li>
					));
				}

				return (
					<tr key={item.id}>
						<td className="ellipsis"><span title={item.name}>{item.name}</span></td>
						<td className="ellipsis"><ul className="list--inline">{artistLinks}</ul></td>
						<td className="ellipsis">{albumLink}</td>
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
						<th className="heading--name"><button className={this.state.sortKey === 'name' ? 'button--sort' : ''} data-key="name" type="button" onClick={this.onClickSort}>Name</button></th>
						<th className="heading--artist"><button className={this.state.sortKey === 'artist' ? 'button--sort' : ''} data-key="artist" type="button" onClick={this.onClickSort}>Artist</button></th>
						<th className="heading--album"><button className={this.state.sortKey === 'album' ? 'button--sort' : ''} data-key="album" type="button" onClick={this.onClickSort}>Album</button></th>
						<th className="heading--date"><button className={this.state.sortKey === 'date' ? 'button--sort' : ''} data-key="date" type="button" onClick={this.onClickSort}>Year</button></th>
					</tr>
				</thead>
				<tbody>
					{list}
				</tbody>
			</table>
		);
	}
}
