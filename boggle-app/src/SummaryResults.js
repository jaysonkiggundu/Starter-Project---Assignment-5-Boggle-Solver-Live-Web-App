// SummaryResults.js
import React from "react";
import "./SummaryResults.css";
import solutionsData from "./Boggle_Solutions_Endpoint.json";

function SummaryResults({ words, totalTime, foundWords = [], boardSize }) {
  // Pull the correct solution set directly from the endpoint
  const allSolutions = (solutionsData[boardSize]?.solutions || []).map(w => w.toLowerCase());

  // Normalize found words (case-insensitive)
  const foundSet = new Set(foundWords.map(w => String(w).toLowerCase()));

  // Correctly filter out found words and match grid size
  const missedWords = allSolutions.filter(
    w => !foundSet.has(w.toLowerCase()) && w.length === Number(boardSize)
  );

  return (
    <div className="Found-solutions-list">
      <h2>SUMMARY</h2>

      <div>
        <li key="12">Total Words Found: {foundWords.length}</li>
      </div>

      <div>
        <li key="15">Total Time: {totalTime} secs</li>
      </div>

      <div>
        <li key="18">
          Missed Words [wordsize {boardSize}]: {missedWords.length}
        </li>
        <ul>
          {missedWords.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SummaryResults;
