import dotenv from 'dotenv';
import ReactDOM from 'react-dom';
import Cache from './js/helpers/Cache';
import Element from './js/helpers/Element';
import 'normalize.css';
import './scss/style.scss';

dotenv.config();

const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
  Cache.set('token', token);
  Cache.set('expires', params.get('expires'));
  window.location.replace(window.location.origin);
} else {
  ReactDOM.render(Element(), document.getElementById('root'));
}

/**
 * @description Adds Google Analytics script to the page.
 */
function initGoogleAnalytics() {
  let script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GOOGLE_ANALYTICS_ID}`);
  document.body.appendChild(script);

  script = document.createElement('script');
  script.innerHTML = [
    'window.dataLayer = window.dataLayer || [];',
    'function gtag(){dataLayer.push(arguments);}',
    'gtag(\'js\', new Date());',
    `gtag('config', '${process.env.REACT_APP_GOOGLE_ANALYTICS_ID}');`,
  ].join('\n');
  document.body.appendChild(script);
}

if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
  initGoogleAnalytics();
}
