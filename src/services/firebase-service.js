// src/services/firebase-service.js
import { collection, getDocs, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase-config";

// Función para obtener la lista de jugadores
export const fetchPlayers = async () => {
  const querySnapshot = await getDocs(collection(db, "players"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Función para registrar un partido
export const registerMatch = async ({ team1, team2, winner, mvp }) => {
  try {
    await addDoc(collection(db, "matches"), {
      team1,
      team2,
      winner,
      mvp,
      date: new Date().toISOString(),
    });

    const winnerTeam = winner === "team1" ? team1 : team2;

    const allPlayers = [...team1, ...team2];
    for (const playerId of allPlayers) {
      const playerRef = doc(db, "players", playerId);
      await updateDoc(playerRef, { matchesPlayed: increment(1) });
    }

    for (const playerId of winnerTeam) {
      const playerRef = doc(db, "players", playerId);
      await updateDoc(playerRef, { wins: increment(1) });
    }

    if (mvp) {
      const mvpRef = doc(db, "players", mvp);
      await updateDoc(mvpRef, { mvps: increment(1) });
    }

    console.log("Partido registrado exitosamente.");
  } catch (error) {
    console.error("Error al registrar el partido: ", error);
  }
};
