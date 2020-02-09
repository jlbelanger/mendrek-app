import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import Splash from '../../components/Splash';

Enzyme.configure({ adapter: new Adapter() });

const component = () => (
  <Splash />
);

describe('Splash', () => {
  test('shows login button', () => {
    const button = shallow(component()).find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Login with Spotify');
  });

  describe('when clicking login button', () => {
    test('redirects to authentication page', () => {
      window.location.assign = jest.fn();
      shallow(component()).find('button').simulate('click');
      expect(window.location.assign).toBeCalledWith('http://localhost:5309/authenticate');
    });
  });
});
