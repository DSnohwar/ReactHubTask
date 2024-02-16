"use client"
import React, { useState } from 'react';
import axios from 'axios';

const LICHESS_GAMES_API = 'https://lichess.org/api/games/user/{username}';
const MAX_GAMES = 10;

function User() {
  const [username, setUsername] = useState('');
  const [topGames, setTopGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const fetchTopGames = async () => {
    if (!username) {
      setError('Please enter a Lichess username.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(LICHESS_GAMES_API.replace('{username}', username), {
        params: {
          max: MAX_GAMES,
          rated: true,
          vs: '',
          perf: 'bullet,rapid,classical',
          sort: 'dateDesc',
          format: 'json',
        },
      });
      console.log(response.data);

      setTopGames(response.data);
    } catch (error) {
      console.error(error);
      setError('Unable to fetch top games. Please check the username or try again later.');
    } finally {
      setLoading(false);``
    }
  };

  const fetchGameDetails = async (gameId) => {
    try {
      const response = await axios.get(`https://lichess.org/api/game/export/${gameId}`);
      setSelectedGame(response.data);
    } catch (error) {
      console.error('Error fetching game details:', error);
      setError('Unable to fetch game details. Please try again later.');
    }
  };

  const closeDetails = () => {
    setSelectedGame(null);
  };

  return (
    <div>
      <h1>Lichess Top Games</h1>
      <input
        type="text"
        required
        className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
        placeholder="Enter Lichess username"
        value={username}
        onChange={handleUsernameChange}
      />
      <button onClick={fetchTopGames}
      className="bg-blue-500 hover:bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg w-full">Fetch Top Games</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {topGames && topGames.length > 0 && (
        <ul>
          {topGames.map((game) => (
            <li key={game.id}>
              <p>
                Game ID: {game.id} | Status: {game.status} | Opponents: {game.white.username} vs. {game.black.username} | Moves: {game.moves}
              </p>
              <button onClick={() => fetchGameDetails(game.id)}>View Details</button>
            </li>
          ))}
        </ul>
      )}
      {selectedGame && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeDetails}>&times;</span>
            <h2>Game Details</h2>
            <p>Winner: {selectedGame.winner}</p>
            <p>Length: {selectedGame.moves.length}</p>
            <p>Opening: {selectedGame.opening.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
