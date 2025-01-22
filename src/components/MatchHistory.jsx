import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebase-config";
import "./MatchHistory.css";

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState({});
  const [loading, setLoading] = useState(true);

  // Obtener jugadores y convertirlos en un diccionario para fácil acceso
  const fetchPlayers = async () => {
    const querySnapshot = await getDocs(collection(db, "players"));
    const playerMap = {};
    querySnapshot.forEach((doc) => {
      playerMap[doc.id] = doc.data().name; // Almacena { playerId: "Nombre del jugador" }
    });
    return playerMap;
  };

  // Obtener historial de partidos desde Firebase
  const fetchMatches = async () => {
    const querySnapshot = await getDocs(collection(db, "matches"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [playerData, matchData] = await Promise.all([
          fetchPlayers(),
          fetchMatches(),
        ]);
        setPlayers(playerData); // Diccionario de jugadores
        setMatches(matchData); // Lista de partidos
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <p className="loading">Cargando historial de partidos...</p>;
  }

  return (
    <div className="match-history">
      <h1>Historial de Partidos</h1>
      {matches.length === 0 ? (
        <p className="no-matches">No hay partidos registrados aún.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id} className="match-card">
            <p className="match-date">{new Date(match.date).toLocaleString()}</p>
            <div className="teams">
              <div className="team">
                <h2>Equipo 1</h2>
                <ul>
                  {match.team1.map((playerId) => (
                    <li key={playerId}>{players[playerId] || "Desconocido"}</li>
                  ))}
                </ul>
              </div>
              <div className="team">
                <h2>Equipo 2</h2>
                <ul>
                  {match.team2.map((playerId) => (
                    <li key={playerId}>{players[playerId] || "Desconocido"}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="winner">
              <strong>Ganador:</strong>{" "}
              {match.winner === "team1" ? "Equipo 1" : "Equipo 2"}
            </p>
            <p className="mvp">
              <strong>MVP:</strong> {players[match.mvp] || "Desconocido"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchHistory;
