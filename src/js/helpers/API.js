import { trackPromise } from 'react-promise-tracker';
import Auth from './Auth';
import Cache from './Cache';

export default class API {
	static hasCache = true

	static refreshIntervalSeconds = 60

	/**
	 * Makes a request to the API.
	 * @param {string} endpoint
	 * @returns {Promise}
	 */
	static request(endpoint) {
		if (!Auth.isLoggedIn()) {
			return Promise.resolve()
				.then(() => {
					throw Error('No token.');
				});
		}

		// Check if the request has already been cached.
		if (API.hasCache) {
			const output = Cache.get(endpoint);
			if (output) {
				return Promise.resolve()
					.then(() => output);
			}
		}

		const url = `${API.url()}${endpoint}`;
		const options = {
			method: 'GET',
			headers: {
				Authentication: `Bearer ${Auth.getToken()}`,
			},
		};

		return trackPromise(fetch(url, options)
			.then((response) => response.json())
			.then((response) => {
				if (!response.success) {
					throw Error(response.data);
				}

				Cache.set(endpoint, response.data);

				return response.data;
			}));
	}

	/**
	 * Returns the API URL.
	 * @returns {string}
	 */
	static url() {
		return process.env.REACT_APP_MENDREK_API_URL;
	}

	/**
	 * Starts refresh token interval.
	 */
	static initRefresh() {
		API.refreshAccessToken();
		const refreshInterval = setInterval(() => {
			API.refreshAccessToken();
		}, API.refreshIntervalSeconds * 1000);
		return refreshInterval;
	}

	/**
	 * Returns the current datetime plus an offset.
	 * @returns {string}
	 */
	static getThresholdDate() {
		const date = new Date(Date.now() + (API.refreshIntervalSeconds * 2000));
		return date.toISOString().slice(0, 19).replace('T', ' ');
	}

	/**
	 * Refreshes the access token.
	 */
	static refreshAccessToken() {
		const threshold = API.getThresholdDate();
		if (threshold < Auth.getExpires()) {
			return;
		}

		API.request('/authenticate/refresh')
			.then((data) => {
				Auth.setToken(data.access_token, data.expires);
			});
	}
}
