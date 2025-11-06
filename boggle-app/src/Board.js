// Board.js
import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import "./Board.css";

function Board({ board }) {
  function tile(id, letter) {
    return (
      <Grid key={id} item xs={1} className="Tile">
        <Paper elevation={4}>{letter}</Paper>
      </Grid>
    );
  }

  function rowOfTiles(id, rowObj) {
    return (
      <Grid key={id} container spacing={1} justifyContent="space-around">
        {Object.keys(rowObj).map((letterKey) =>
          tile(letterKey + id, rowObj[letterKey])
        )}
      </Grid>
    );
  }

  function gridOfRows(board) {
    return (
      <Grid item xs={12}>
        {Object.keys(board).map((rowKey) =>
          rowOfTiles(rowKey, board[rowKey])
        )}
      </Grid>
    );
  }

  return (
    <div className="Board-div">
      <Grid container justifyContent="center">
        {board && board.length > 0 && gridOfRows(board)}
      </Grid>
    </div>
  );
}

export default Board;
