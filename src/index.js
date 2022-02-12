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
