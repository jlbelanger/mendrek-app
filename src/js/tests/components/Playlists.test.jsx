import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import Playlists from '../../components/Playlists';

Enzyme.configure({ adapter: new Adapter() });

let data;
const mockOnClickPlaylist = () => {};
const mockRequest = (_, sucessCallback, errorCallback) => {
  if (data !== null) {
    sucessCallback({ data });
  } else {
    errorCallback();
  }
};
const mockView = {
  id: null,
  type: null,
};
const component = () => (
  <Playlists
    onClickPlaylist={mockOnClickPlaylist}
    request={mockRequest}
    view={mockView}
  />
);
let c;

describe('Playlists', () => {
  describe('when there are no playlists', () => {
    beforeEach(() => {
      data = [];
    });

    test('shows no results message', () => {
      const p = shallow(component()).find('p.no-results');
      expect(p.exists()).toBe(true);
      expect(p.text()).toBe('No playlists found.');
    });
  });

  describe('when playlists could not be fetched', () => {
    beforeEach(() => {
      data = null;
    });

    test('shows error message', () => {
      const p = shallow(component()).find('p.no-results');
      expect(p.exists()).toBe(true);
      expect(p.text()).toBe('Error fetching playlists.');
    });
  });

  describe('when there are playlists', () => {
    beforeEach(() => {
      data = {
        items: [
          { id: '1', name: 'Classic Rock' },
          { id: '2', name: 'Country' },
          { id: '3', name: 'Hard Rock' },
        ],
      };
    });

    describe('when the search field is not set', () => {
      test('shows all playlists', () => {
        const list = shallow(component()).find('#playlists');
        expect(list.exists()).toBe(true);
        expect(list.find('li').length).toBe(3);
      });
    });

    describe('when the search field is set', () => {
      beforeEach(() => {
        c = shallow(component());
        c.setState({ filterValue: 'rock' });
      });

      test('filters playlists', () => {
        const list = c.find('#playlists');
        expect(list.exists()).toBe(true);
        expect(list.find('li').length).toBe(2);
      });
    });
  });
});
