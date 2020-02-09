import Cache from './Cache';

export default class API {
  /**
   * @description Initializes API.
   */
  constructor() {
    this.token = Cache.get('token');
    this.expires = Cache.get('expires');
    this.hasCache = true;
    this.refreshIntervalSeconds = 60;
    this.refreshInterval = null;

    if (this.token) {
      this.initRefresh();
    }
  }

  static url() {
    return process.env.REACT_APP_MENDREK_API_URL;
  }

  /**
   * @description Makes a request to the API.
   * @param {string} endpoint
   * @returns {Promise}
   */
  request(endpoint) {
    if (!this.token) {
      return Promise.resolve()
        .then(() => {
          throw Error('No token.');
        });
    }

    // Check if the request has already been cached.
    if (this.hasCache) {
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
        Authentication: `Bearer ${this.token}`,
      },
    };

    return fetch(url, options)
      .then(response => response.json())
      .then((response) => {
        if (!response.success) {
          throw Error(response.data);
        }

        Cache.set(endpoint, response.data);

        return response.data;
      });
  }

  /**
   * @description Starts refresh token interval.
   */
  initRefresh() {
    const seconds = this.refreshIntervalSeconds * 1000;
    this.refreshAccessToken();
    this.refreshInterval = setInterval(() => {
      this.refreshAccessToken();
    }, seconds);
  }

  /**
   * @description Returns the current datetime plus an offset.
   * @returns {string}
   */
  getThresholdDate() {
    const date = new Date(Date.now() + (this.refreshIntervalSeconds * 2000));
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * @description Refreshes the access token.
   */
  refreshAccessToken() {
    const threshold = this.getThresholdDate();
    if (threshold < this.expires) {
      return;
    }

    this.request('/authenticate/refresh')
      .then((data) => {
        this.token = data.access_token;
        this.expires = data.expires;
        Cache.set('token', this.token);
        Cache.set('expires', this.expires);
      });
  }
}
