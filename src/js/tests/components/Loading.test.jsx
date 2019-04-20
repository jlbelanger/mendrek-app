import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import Loading from '../../components/Loading';

Enzyme.configure({ adapter: new Adapter() });

let mockLoading;
const component = () => (
  <Loading loading={mockLoading} />
);

describe('Loading', () => {
  describe('when things are loading', () => {
    beforeEach(() => {
      mockLoading = 1;
    });

    test('renders the loading icon', () => {
      expect(shallow(component()).find('div').exists()).toBe(true);
    });
  });

  describe('when nothing is loading', () => {
    beforeEach(() => {
      mockLoading = 0;
    });

    test('does not render the loading icon', () => {
      expect(shallow(component()).find('div').exists()).toBe(false);
    });
  });
});
