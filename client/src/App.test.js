import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PlaylistCard from './components/common/playlistCard';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock('@heroui/react', () => ({
  useDisclosure: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onOpenChange: jest.fn(),
  }),
}));

test('navigates to the playlist detail route when a playlist card is clicked', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={
          <PlaylistCard
            parentComponent="playlist"
            playlist={{
              _id: 'play_123',
              playlistName: 'Road Trip',
              name: 'Road Trip',
              image: '/images/playlists.png',
              songs: [],
            }}
            setDisplaySongs={jest.fn()}
            setSelectedPlaylistData={jest.fn()}
            fetchSelectedPlaylistSongs={jest.fn()}
            showDeleteButton={false}
          />
        } />
        <Route path="/playlist/:playlistId" element={<div>Playlist route loaded</div>} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByTitle('Road Trip'));

  expect(screen.getByText(/playlist route loaded/i)).toBeInTheDocument();
});
