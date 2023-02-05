const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use = express.json();
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at https://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error:${message}`);
    process.exit(1);
  }
};

initializeDBServer();
//API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
        *
    FROM
        cricket_Team
    ORDER BY 
        player_id;
    `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
        INSERT INTO
         cricket_Team(player_Id,player_name,jersey_number,role)
         
         VALUES
         (
             '${playerId}',
             '${playerName}',
             '${jerseyNumber}',
             '${role}',
         )`;

  const dbResponse = await db.run(addPlayerQuery);
  const PlayerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
        SELECT
            *
        FROM 
            cricket_Team
        WHERE player_id = ${playerId}`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE 
        cricket_Team
    SET
        player_name ='${playerName}',
        jersey_number = '${jerseyNumber}',
        role = '${role}'
    WHERE player_id = ${playerId}`;
  const UpdatePlayer = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
        DELETE FROM
            cricket_Team
        WHERE
            player_id = ${playerId}`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
