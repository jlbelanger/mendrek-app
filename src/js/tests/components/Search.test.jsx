import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import Search from '../../components/Search';

Enzyme.configure({ adapter: new Adapter() });

const mockFilter = () => {};
const component = () => (
	<Search filter={mockFilter} type="widgets" />
);
let c;

describe('Search', () => {
	test('labels the input with the type', () => {
		expect(shallow(component()).find('input[aria-label="Filter widgets"]').exists()).toBe(true);
	});

	describe('when not searching', () => {
		test('labels the button with the type', () => {
			const button = shallow(component()).find('button.button--search');
			expect(button.exists()).toBe(true);
			expect(button.text()).toBe('Search widgets');
		});

		describe('when clicking the button', () => {
			test('does not change the input field', () => {
				c = shallow(component());
				expect(c.find('input').props().value).toBe('');
				c.find('button').simulate('click');
				expect(c.find('input').props().value).toBe('');
			});
		});
	});

	describe('when searching', () => {
		beforeEach(() => {
			c = shallow(component());
			c.find('input').simulate('change', { target: { value: 'example' } });
		});

		test('labels the button with the type', () => {
			const button = c.find('button.button--clear');
			expect(button.exists()).toBe(true);
			expect(button.text()).toBe('Clear widgets filter');
		});

		describe('when clicking the button', () => {
			test('clears the input field', () => {
				expect(c.find('input').props().value).toBe('example');
				c.find('button').simulate('click');
				expect(c.find('input').props().value).toBe('');
			});
		});
	});
});
