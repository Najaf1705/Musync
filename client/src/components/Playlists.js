// import React, { useState } from 'react';

// const Playlist = () => {
//   const [playlist, setPlaylist] = useState([
//     { id: 1, title: 'Song 1', artist: 'Artist 1' },
//     { id: 2, title: 'Song 2', artist: 'Artist 2' },
//     { id: 3, title: 'Song 3', artist: 'Artist 3' },
//   ]);
//   const [currentTrack, setCurrentTrack] = useState(null);

//   const playTrack = (track) => {
//     setCurrentTrack(track);
//   };

//   const pauseTrack = () => {
//     setCurrentTrack(null);
//   };

//   const skipTrack = () => {
//     const currentIndex = playlist.findIndex((track) => track === currentTrack);
//     if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
//       setCurrentTrack(playlist[currentIndex + 1]);
//     }
//   };

//   return (
//     <div className='home'>
//       <div className="mx-2">
//         <h2>Playlist</h2>
//         <ul>
//           {playlist.map((track) => (
//             <li key={track.id}>
//               {track.title} - {track.artist}
//               <button onClick={() => playTrack(track)}>Play</button>
//             </li>
//           ))}
//         </ul>
//         <div>
//           {currentTrack && (
//             <div>
//               <h3>Now Playing: {currentTrack.title}</h3>
//               <button onClick={pauseTrack}>Pause</button>
//               <button onClick={skipTrack}>Skip</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Playlist;
