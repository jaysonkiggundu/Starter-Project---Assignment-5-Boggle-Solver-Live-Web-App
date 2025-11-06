import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "./GuessInput.css";

function GuessInput({ allSolutions, foundSolutions, correctAnswerCallback }) {
  const [labelText, setLabelText] = useState("Make your first guess!");
  const [input, setInput] = useState("");

  function evaluateInput() {
    const guess = input.trim().toUpperCase();

    // Normalize solutions to uppercase
    const normalizedSolutions = allSolutions.map((w) => w.trim().toUpperCase());
    const normalizedFound = foundSolutions.map((w) => w.trim().toUpperCase());

    if (!guess) return;

    if (normalizedFound.includes(guess)) {
      setLabelText(`${guess} has already been found!`);
    } else if (normalizedSolutions.includes(guess)) {
      correctAnswerCallback(guess);
      setLabelText(`${guess} is correct!`);
    } else {
      setLabelText(`${guess} is incorrect!`);
    }

    setInput("");
  }

  function keyPress(e) {
    if (e.key === "Enter") {
      evaluateInput();
    }
  }

  return (
    <div className="Guess-input">
      <div>{labelText}</div>
      <TextField
        value={input}
        onKeyPress={(e) => keyPress(e)}
        onChange={(event) => setInput(event.target.value.toUpperCase())}
      />
    </div>
  );
}

export default GuessInput;
