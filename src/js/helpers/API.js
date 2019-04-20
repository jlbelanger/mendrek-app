import Cache from './Cache';

export default class API {
  /**
   * @description Initializes API.
   */
  constructor() {
    this.token = Cache.get('token');
    this.url = process.env.REACT_APP_MENDREK_API_URL;
    this.hasCache = true;
  }

  /**
   * @description Makes a request to the API.
   * @param {string} endpoint
   * @param {function} callback
   */
  request(endpoint, callback) {
    if (!this.token) {
      return;
    }

    // Check if the request has already been cached.
    if (this.hasCache) {
      const output = Cache.get(endpoint);
      if (output) {
        if (callback) {
          callback(output);
        }
        return;
      }
    }

    const url = `${this.url}${endpoint}`;
    const options = {
      method: 'GET',
      headers: {
        Authentication: `Bearer ${this.token}`,
      },
    };

    fetch(url, options)
      .then(response => response.json())
      .then((response) => {
        if (response.success) {
          Cache.set(endpoint, response);
        }

        if (callback) {
          callback(response);
        }
      });
  }
}
