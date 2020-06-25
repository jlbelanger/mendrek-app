import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';

export default () => {
	const { promiseInProgress } = usePromiseTracker();
	if (!promiseInProgress) {
		return null;
	}

	return (
		<div id="spinner">Loading</div>
	);
};
