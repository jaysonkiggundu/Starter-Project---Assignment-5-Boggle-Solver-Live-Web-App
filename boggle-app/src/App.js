import React, { useState, useEffect, useMemo, useRef } from "react";
import { GAME_STATE } from "./game_state_enum.js";
import Board from "./Board.js";
import GuessInput from "./GuessInput.js";
import FoundSolutions from "./FoundSolutions.js";
import SummaryResults from "./SummaryResults.js";
import ToggleGameState from "./ToggleGameState.js";
import logo from "./logo.svg";
import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuohfsZWtJ24xQF5OHBiEj4A1tFrgI4N0",
  authDomain: "boggle-e2e28.firebaseapp.com",
  projectId: "boggle-e2e28",
  storageBucket: "boggle-e2e28.firebasestorage.app",
  messagingSenderId: "960330689469",
  appId: "1:960330689469:web:ac121b065d4d833c6c00d4",
  measurementId: "G-G3WX87RG4E",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const obj = require("./Boggle_Solutions_Endpoint.json");
  const [user, setUser] = useState(null);
  const [allSolutions, setAllSolutions] = useState([]);
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE);
  const [grid, setGrid] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [size, setSize] = useState(3);
  const [game, setGame] = useState({});
  const [challenges, setChallenges] = useState([]);
  const myMap = useMemo(() => new Map(Object.entries(obj)), [obj]);
  const prevSizeRef = useRef(size);

  function handleLogin() {
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => console.error("❌ Login error:", error));
  }

  function handleLogout() {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("❌ Logout error:", error));
  }

  useEffect(() => {
    setAllSolutions(game.solutions || []);
  }, [grid, game]);

  // 🧩 start NEW random game (resets challenge state)
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      // If not currently in a challenge, start normal random grid
      if (!game.isChallenge) {
        const g = myMap.get(size.toString());
        const normalized = g.solutions.map((w) => w.trim().toUpperCase());
        setGame({ ...g, solutions: normalized, isChallenge: false });
        setGrid(g.grid);
        setAllSolutions(normalized);
        setFoundSolutions([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, size, myMap]);

  // 🧩 reset everything if size changes before a new game
  useEffect(() => {
    if (size !== prevSizeRef.current) {
      if (gameState === GAME_STATE.BEFORE) {
        setFoundSolutions([]);
        setAllSolutions([]);
        setGrid([]);
        setGame({}); // ✅ fully clear previous challenge
      }
      prevSizeRef.current = size;
    }
  }, [size, gameState]);

  async function loadChallengesFromFirebase() {
    try {
      const querySnapshot = await getDocs(collection(db, "challenges"));
      const data = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChallenges(data);
      console.log("🔥 Loaded challenges:", data);
    } catch (error) {
      console.error("❌ Error loading challenges:", error);
    }
  }

  function loadChallenge(ch) {
    try {
      const parsedGrid = JSON.parse(ch.grid);
      let challengeSolutions = [];

      if (ch.foundwords) {
        if (Array.isArray(ch.foundwords)) {
          challengeSolutions = ch.foundwords.map((w) =>
            w.trim().toUpperCase()
          );
        } else if (typeof ch.foundwords === "string") {
          try {
            const parsed = JSON.parse(ch.foundwords.replace(/'/g, '"'));
            challengeSolutions = parsed.map((w) => w.trim().toUpperCase());
          } catch {
            challengeSolutions = ch.foundwords
              .split(",")
              .map((w) => w.trim().toUpperCase());
          }
        }
      }

      setGrid(parsedGrid);
      setGame({
        id: ch.id,
        name: ch.name,
        grid: parsedGrid,
        solutions: challengeSolutions,
        isChallenge: true,
      });
      setAllSolutions(challengeSolutions);
      setSize(ch.size);
      setGameState(GAME_STATE.IN_PROGRESS);
      setFoundSolutions([]);
    } catch (error) {
      console.error("⚠️ Error loading challenge grid:", error);
    }
  }

  async function saveScoreToFirestore(score) {
    try {
      if (!game.isChallenge || !user || !game.id) return;
      const challengeRef = doc(db, "challenges", game.id);
      const snap = await getDoc(challengeRef);
      if (!snap.exists()) return;

      const current = snap.data();
      if (!current.highScore || score > current.highScore) {
        await updateDoc(challengeRef, {
          highScore: score,
          topPlayer: user.displayName || user.email,
        });
        console.log(`🏆 New high score ${score} saved for ${game.name}`);
      }
    } catch (err) {
      console.error("❌ Error saving score:", err);
    }
  }

  function correctAnswerFound(answer) {
    const upper = answer.toUpperCase();
    if (!foundSolutions.map((w) => w.toUpperCase()).includes(upper)) {
      setFoundSolutions([...foundSolutions, upper]);
    }
  }

  // 🧩 Auto-save challenge scores
  useEffect(() => {
    if (gameState === GAME_STATE.ENDED && game.isChallenge && user) {
      const score = foundSolutions.length;
      saveScoreToFirestore(score);
      setGame((prev) => ({ ...prev, isChallenge: false })); // ✅ exit challenge mode
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return (
    <div className="App">
      <img src={logo} width="25%" height="25%" className="logo" alt="Bison Boggle Logo" />

      {user ? (
        <button onClick={handleLogout}>Sign Out</button>
      ) : (
        <button onClick={handleLogin}>Sign In with Google</button>
      )}

      <ToggleGameState
        gameState={gameState}
        setGameState={setGameState}
        setSize={setSize}
        setTotalTime={setTotalTime}
      />

      <button onClick={loadChallengesFromFirebase}>🔥 Load Challenges</button>

      {challenges.length > 0 && (
        <div>
          <h3>Available Challenges</h3>
          <ul>
            {challenges.map((ch) => (
              <li key={ch.id}>
                <button onClick={() => loadChallenge(ch)}>
                  {ch.name} — Size: {ch.size} — High Score: {ch.highScore || 0}
                  {ch.topPlayer ? ` — By: ${ch.topPlayer}` : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {gameState === GAME_STATE.IN_PROGRESS && (
        <div>
          <Board board={grid} />
          <GuessInput
            allSolutions={allSolutions}
            foundSolutions={foundSolutions}
            correctAnswerCallback={correctAnswerFound}
          />
          <FoundSolutions headerText="Solutions you've found" words={foundSolutions} />
        </div>
      )}

      {gameState === GAME_STATE.ENDED && (
        <div>
          <Board board={grid} />
          <SummaryResults
            words={allSolutions}
            totalTime={totalTime}
            foundWords={foundSolutions}
            boardSize={size}
          />
          <FoundSolutions headerText="Words You Found" words={foundSolutions} />
        </div>
      )}
    </div>
  );
}

export default App;
