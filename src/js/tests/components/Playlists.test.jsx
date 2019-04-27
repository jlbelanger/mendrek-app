import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import Playlists from '../../components/Playlists';

Enzyme.configure({ adapter: new Adapter() });

let data;
const mockRequest = () => (
  Promise.resolve().then(() => data)
);
const component = () => (
  <Playlists request={mockRequest} />
);
let c;

describe('Playlists', () => {
  describe('when there are no playlists', () => {
    beforeEach(() => {
      data = [];
      c = shallow(component());
    });

    test('shows no results message', () => {
      const p = c.find('p.no-results');
      expect(p.exists()).toBe(true);
      expect(p.text()).toBe('No playlists found.');
    });
  });

  describe('when playlists could not be fetched', () => {
    beforeEach(() => {
      data = null;
      c = shallow(component());
    });

    test('shows error message', () => (
      Promise.resolve()
        .then(() => null)
        .then(() => {
          const p = c.find('p.no-results');
          expect(p.exists()).toBe(true);
          expect(p.text()).toBe('Error fetching playlists.');
        })
    ));
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
      c = shallow(component());
    });

    describe('when the search field is not set', () => {
      test('shows all playlists', () => (
        Promise.resolve()
          .then(() => null)
          .then(() => {
            const list = c.find('#playlists');
            expect(list.exists()).toBe(true);
            expect(list.find('li').length).toBe(3);
          })
      ));
    });

    describe('when the search field is set', () => {
      beforeEach(() => {
        c.setState({ filterValue: 'rock' });
      });

      test('filters playlists', () => (
        Promise.resolve()
          .then(() => null)
          .then(() => {
            const list = c.find('#playlists');
            expect(list.exists()).toBe(true);
            expect(list.find('li').length).toBe(2);
          })
      ));
    });
  });
});
