import PropTypes from 'prop-types';
import React from 'react';
import { ReactComponent as ClearIcon } from '../../svg/x.svg';
import { ReactComponent as SearchIcon } from '../../svg/search.svg';

export default class Search extends React.Component {
	state = {
		value: '',
	}

	static propTypes = {
		filter: PropTypes.func.isRequired,
		type: PropTypes.string.isRequired,
	}

	/**
	 * @description Handles button click.
	 */
	onClick = () => {
		if (this.isSearching()) {
			this.clear();
		}
	}

	/**
	 * @description Prevents page reload on form submission.
	 * @param {Object} e
	 */
	onSubmit = (e) => {
		e.preventDefault();
	}

	/**
	 * @description Filters the results by the current search field value.
	 * @param {Object} e
	 */
	filter = (e) => {
		this.setState({ value: e.target.value });
		this.props.filter(e.target.value);
	}

	/**
	 * @description Clears the search field value.
	 */
	clear() {
		this.setState({ value: '' });
		this.props.filter('');
	}

	/**
	 * @description Returns true if the search field is not empty.
	 */
	isSearching() {
		return this.state.value;
	}

	/**
	 * @description Renders the component.
	 */
	render() {
		const inputLabel = `Filter ${this.props.type}`;
		const buttonClass = `postfix button--icon button--${this.isSearching() ? 'clear' : 'search'}`;
		const buttonText = this.isSearching() ? `Clear ${this.props.type} filter` : `Search ${this.props.type}`;
		let Icon;
		if (this.isSearching()) {
			Icon = ClearIcon;
		} else {
			Icon = SearchIcon;
		}

		return (
			<form onSubmit={this.onSubmit}>
				<p className="search">
					<input aria-label={inputLabel} className="prefix" placeholder={inputLabel} type="text" value={this.state.value} onChange={this.filter} />
					<button className={buttonClass} type="button" onClick={this.onClick}>
						<Icon />
						<span>{buttonText}</span>
					</button>
				</p>
			</form>
		);
	}
}
