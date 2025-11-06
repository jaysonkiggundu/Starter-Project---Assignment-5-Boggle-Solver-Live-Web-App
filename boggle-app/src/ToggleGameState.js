import React, { useState, useEffect, useCallback } from "react";
import { GAME_STATE } from "./game_state_enum.js";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import "./ToggleGameState.css";

function ToggleGameState({ gameState, setGameState, setSize, setTotalTime }) {
  const [buttonText, setButtonText] = useState("Start a new game!");
  const [startTime, setStartTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes

  // ✅ Handles start / end logic
  const updateGameState = useCallback(
    (endTime) => {
      if (gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) {
        setStartTime(Date.now());
        setTimeRemaining(180);
        setGameState(GAME_STATE.IN_PROGRESS);
        setButtonText("End game");
      } else if (gameState === GAME_STATE.IN_PROGRESS) {
        const deltaTime = (endTime - startTime) / 1000.0;
        setTotalTime(deltaTime);
        setGameState(GAME_STATE.ENDED);
        setButtonText("Start a new game!");
      }
    },
    [gameState, startTime, setGameState, setTotalTime]
  );

  // ✅ Timer countdown
  useEffect(() => {
    let timer;
    if (gameState === GAME_STATE.IN_PROGRESS && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === GAME_STATE.IN_PROGRESS) {
      updateGameState(Date.now());
    }
    return () => clearInterval(timer);
  }, [gameState, timeRemaining, updateGameState]);

  const handleChange = (event) => {
    setSize(event.target.value);
  };

  // ✅ When a challenge starts externally (via LoadChallenge),
  // make sure the button immediately says "End game"
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      setButtonText("End game");
    } else if (gameState === GAME_STATE.BEFORE) {
      setButtonText("Start a new game!");
    }
  }, [gameState]);

  return (
    <div className="Toggle-game-state">
      {gameState === GAME_STATE.IN_PROGRESS && (
        <div>Time Remaining: {timeRemaining}s</div>
      )}
      <Button variant="outlined" onClick={() => updateGameState(Date.now())}>
        {buttonText}
      </Button>

      {(gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) && (
        <div className="Input-select-size">
          <FormControl>
            <Select
              labelId="sizelabel"
              id="sizemenu"
              onChange={handleChange}
              defaultValue={3}
              disabled={gameState === GAME_STATE.IN_PROGRESS}
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Set Grid Size</FormHelperText>
          </FormControl>
        </div>
      )}
    </div>
  );
}

export default ToggleGameState;
