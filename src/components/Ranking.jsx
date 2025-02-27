import { useState, useEffect } from 'react';
import { fetchPlayers } from "../services/firebase-service";
import './Ranking.css'

const Ranking = () => {
    const [sortBy, setSortBy] = useState('gamesPlayed');
  const [sortOrder, setSortOrder] = useState('desc');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const playerList = await fetchPlayers();
      setPlayers(playerList);
    };
    loadPlayers();
  }, []);

  console.log(players)

  const sortPlayers = (key) => {
    const order = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedPlayers = [...players].sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setPlayers(sortedPlayers);
    setSortBy(key);
    setSortOrder(order);
  };

  return (
    <div className="ranking-container">
    <h1>Fulbito Ranking</h1>
      <h2>Ranking de Jugadores</h2>
      <table className="ranking-table">
      <thead>
  <tr>
    <th onClick={() => sortPlayers('name')}>
      Jugador {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
    <th onClick={() => sortPlayers('matchesPlayed')}>
      Partidos Jugados {sortBy === 'matchesPlayed' && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
    <th onClick={() => sortPlayers('wins')}>
      Partidos Ganados {sortBy === 'wins' && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
    <th onClick={() => sortPlayers('mvps')}>
      MVPs {sortBy === 'mvps' && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
    <th>
      % Victorias
    </th>
  </tr>
</thead>
<tbody>
  {players.map(player => {
    // Calcular porcentaje de victorias
    const winPercentage = player.matchesPlayed === 0 ? 0 : (player.wins / player.matchesPlayed) * 100;
    return (
      <tr key={player.name}>
        <td>{player.name}</td>
        <td>{player.matchesPlayed}</td>
        <td>{player.wins}</td>
        <td>{player.mvps}</td>
        <td>{winPercentage.toFixed(2)}%</td> {/* Muestra el porcentaje con dos decimales */}
      </tr>
    );
  })}
</tbody>
      </table>
    </div>
  );
}

export default Ranking