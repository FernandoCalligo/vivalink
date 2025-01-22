import { useState, useEffect } from "react";
import { fetchPlayers, registerMatch } from "../services/firebase-service";
import './RegisterMatch.css'

const RegisterMatch = () => {
  const [players, setPlayers] = useState([]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [winner, setWinner] = useState("");
  const [mvp, setMvp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cargar jugadores desde Firebase
  useEffect(() => {
    const loadPlayers = async () => {
      const playerList = await fetchPlayers();
      setPlayers(playerList);
    };
    loadPlayers();
  }, []);

  // Validación del formulario
  const isFormValid =
    team1.length === 5 &&
    team2.length === 5 &&
    winner &&
    mvp;

  // Registrar el partido
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      await registerMatch({ team1, team2, winner, mvp });
      setMessage("¡Partido registrado exitosamente!");
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Error al registrar el partido. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setTeam1([]);
    setTeam2([]);
    setWinner("");
    setMvp("");
  };

  // Renderizar lista de jugadores
  const renderPlayerList = (team, setTeam) => (
    <div className="player-list">
      {players.map((player) => (
        <button
          key={player.id}
          className={`player-button ${
            team.includes(player.id) ? "selected" : ""
          }`}
          onClick={() => togglePlayer(team, setTeam, player.id)}
        >
          {player.name}
        </button>
      ))}
    </div>
  );

  // Alternar selección de jugadores
  const togglePlayer = (team, setTeam, playerId) => {
    if (team.includes(playerId)) {
      setTeam(team.filter((id) => id !== playerId));
    } else if (team.length < 5) {
      setTeam([...team, playerId]);
    }
  };

  return (
    <div className="register-match">
      <h1>Registrar Partido</h1>
      <div className="match-teams">
        <div>
            {/* Equipo 1 */}
          <h2>Equipo 1</h2>
          {renderPlayerList(team1, setTeam1)}
          <p>{team1.length} / 5 jugadores seleccionados</p>
        </div>
        <div>
          {/* Equipo 2 */}
          <h2>Equipo 2</h2>
          {renderPlayerList(team2, setTeam2)}
          <p>{team2.length} / 5 jugadores seleccionados</p>
        </div>
      </div>
      {/* Ganador */}
      <h2>Ganador</h2>
      <select value={winner} onChange={(e) => setWinner(e.target.value)}>
        <option value="">Seleccionar</option>
        <option value="team1">Equipo 1</option>
        <option value="team2">Equipo 2</option>
      </select>

      {/* MVP */}
      <h2>MVP</h2>
      <select value={mvp} onChange={(e) => setMvp(e.target.value)}>
        <option value="">Seleccionar</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>

      {/* Botón Registrar */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
        className={`submit-button ${isFormValid ? "" : "disabled"}`}
      >
        {loading ? "Registrando..." : "Registrar Partido"}
      </button>

      {/* Mensaje de resultado */}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterMatch;
