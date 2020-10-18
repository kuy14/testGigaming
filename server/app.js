const Express = require("express");
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var gameStatus = {
  player1_status: false,
  player2_status: false,
  player1_name: "insert player 1 name",
  player2_name: "insert player 2 name",
  game_round: 1,
  now_playing: "player1",
  player1_point: 0,
  player2_point: 0,
  player1_option: "",
  player2_option: "",
  winner_option: "",
  game_status: "not playing",
  winner: "",
};

Socketio.on("connection", (socket) => {
  socket.emit("gameStatus", gameStatus);
  socket.on("setPlay", (data) => {
    gameStatus.player1_name = data;
    Socketio.emit("gameStatus", gameStatus);
  });
  socket.on("setPlayer", (data) => {
    switch (data) {
      case "player1":
        gameStatus.player1_status = true;
        Socketio.emit("gameStatus", gameStatus);
        break;
      case "player2":
        gameStatus.player2_status = true;
        Socketio.emit("gameStatus", gameStatus);
        break;
    }
  });
  socket.on("setPlayerName", (data) => {
    switch (data.player) {
      case "player1":
        gameStatus.player1_name = data.name;
        Socketio.emit("gameStatus", gameStatus);
        break;
      case "player2":
        gameStatus.player2_name = data.name;
        Socketio.emit("gameStatus", gameStatus);
        break;
    }
  });
  socket.on("setNowPlaying", (data) => {
    gameStatus.now_playing = data;
    Socketio.emit("gameStatus", gameStatus);
  });
  socket.on("setGameStatus", (data) => {
    gameStatus.game_status = data;
    Socketio.emit("gameStatus", gameStatus);
  });
  socket.on("resetGame", (data) => {
    gameStatus = data;
    Socketio.emit("gameStatus", gameStatus);
  });
  socket.on("setOption", (data) => {
    switch (data.player) {
      case "player1":
        gameStatus.player1_option = data.option;
        Socketio.emit("gameStatus", gameStatus);
        break;
      case "player2":
        gameStatus.player2_option = data.option;
        Socketio.emit("gameStatus", gameStatus);
        matching();
        if (gameStatus.game_round === 5) {
          gameStatus.game_status = "end";
          if (gameStatus.player1_point > gameStatus.player2_point) {
            gameStatus.winner = "player1";
          } else if (gameStatus.player1_point == gameStatus.player2_point) {
            gameStatus.winner = "Tie";
          } else {
            gameStatus.winner = "player2";
          }
          Socketio.emit("gameStatus", gameStatus);
        }
        break;
    }
  });
  function matching() {
    if (
      gameStatus.player1_option == "scissors" &&
      gameStatus.player2_option == "scissors"
    ) {
      gameStatus.player1_point += 1;
      gameStatus.player2_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option =
        "scissors fight againts scissors: scissors win";
    } else if (
      gameStatus.player1_option == "scissors" &&
      gameStatus.player2_option == "paper"
    ) {
      gameStatus.player1_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "scissors fight againts paper: scissors win";
    } else if (
      gameStatus.player1_option == "scissors" &&
      gameStatus.player2_option == "rock"
    ) {
      gameStatus.player2_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "scissors fight againts rock: rock win";
    } else if (
      gameStatus.player1_option == "paper" &&
      gameStatus.player2_option == "scissors"
    ) {
      gameStatus.player2_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "paper fight againts scissors: scissors win";
    } else if (
      gameStatus.player1_option == "paper" &&
      gameStatus.player2_option == "paper"
    ) {
      gameStatus.player1_point += 1;
      gameStatus.player2_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "paper fight againts paper: paper win";
    } else if (
      gameStatus.player1_option == "paper" &&
      gameStatus.player2_option == "rock"
    ) {
      gameStatus.player1_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "paper fight againts rock: paper win";
    } else if (
      gameStatus.player1_option == "rock" &&
      gameStatus.player2_option == "scissors"
    ) {
      gameStatus.player1_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "rock fight againts scissors: rock win";
    } else if (
      gameStatus.player1_option == "rock" &&
      gameStatus.player2_option == "paper"
    ) {
      gameStatus.player2_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "rock fight againts paper: paper win";
    } else if (
      gameStatus.player1_option == "rock" &&
      gameStatus.player2_option == "rock"
    ) {
      gameStatus.player1_point += 1;
      gameStatus.player2_point += 1;
      gameStatus.game_round += 1;
      gameStatus.winner_option = "rock fight againts rock: rock win";
    }
  }
  socket.on("matching", (data) => {});
});

Http.listen(3000, () => {
  console.log("Listening at :3000...");
});
