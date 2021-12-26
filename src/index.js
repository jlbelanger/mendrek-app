import ReactDOM from 'react-dom';
import Auth from './js/helpers/Auth';
import Element from './js/helpers/Element';
import 'normalize.css';
import './scss/style.scss';

const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
	Auth.setToken(token, params.get('expires'));
	window.location.replace(window.location.origin);
} else {
	ReactDOM.render(Element(), document.getElementById('root'));
}

/**
 * Adds Google Analytics script to the page.
 */
function initGoogleAnalytics() {
	if (!process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
		return;
	}

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
