import Cache from './Cache';

export default class Auth {
	/**
	 * Returns the current user's token.
	 * @returns {string}
	 */
	static getToken() {
		return Cache.get('token');
	}

	/**
	 * Returns the current user's token expiry.
	 * @returns {number}
	 */
	static getExpires() {
		return Cache.get('expires');
	}

	/**
	 * Returns true if a user is logged in.
	 * @returns {boolean}
	 */
	static isLoggedIn() {
		return !!Auth.getToken();
	}

	/**
	 * Sets the current user's token.
	 * @param {string} token
	 * @param {number} expires
	 */
	static setToken(token, expires) {
		Cache.set('token', token);
		Cache.set('expires', expires);
	}
}
