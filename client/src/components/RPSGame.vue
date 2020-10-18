<template>
  <div>
    <div class="cont">
      <div class="row">
        <div class="cont-1">
          <Character />
        </div>
        <div class="cont-2">
          <h1>Rock Paper Scissors</h1>
          <h6>Multiplayer game of Rock Paper Scissors</h6>
          <div class="cont-game">
            <div id="main-container">
              <div class="set-game-cont">
                <h4>How to Play :</h4>
                <p>
                  Open multiple game, each game in different browser<br />
                  Choose between Player 1 or Player 2 and give it name <br />
                  Click Play button in Player 1
                </p>
                <p class="mt-5">Choose Player</p>
                <button
                  id="btnPlayer1"
                  class="btn-player"
                  v-on:click="setPlayer('player1')"
                >
                  Player 1</button
                ><br />
                <button
                  id="btnPlayer2"
                  class="btn-player"
                  v-on:click="setPlayer('player2')"
                >
                  Player 2
                </button>
              </div>
              <br /><br />
              <div id="contPlayer1Name" style="display: none">
                <label for="player1">Player 1 Name</label><br />
                <input
                  type="text"
                  name="player1"
                  id="player1"
                  class="text-name"
                  v-model="player1"
                />
                <br />
                <button
                  class="btn-save-player"
                  v-on:click="saveName('player1')"
                >
                  Save
                </button>
                <br /><br />
              </div>
              <div id="contPlayer2Name" style="display: none">
                <label for="player1">Player 2 Name</label><br />
                <input
                  type="text"
                  name="player1"
                  class="text-name"
                  id="player1"
                  v-model="player2"
                />
                <br />
                <button
                  class="btn-save-player"
                  v-on:click="saveName('player2')"
                >
                  Save
                </button>
              </div>
              <br />
              <h4 id="status"></h4>
              <button
                id="btnPlay"
                class="btn-play"
                v-on:click="setPlay()"
                disabled
              >
                Play
              </button>
            </div>
            <div id="onplay-container" style="display: none;">
              <div class="point-status">
                <div class="cont-point">
                  <div class="box-player">
                    <div class="box-name">
                      <h5 style="margin: 0;">Player 1</h5>
                      <h3 style="margin: 10px;">
                        {{ this.gameStatus.player1_name }}
                      </h3>
                    </div>
                    <div class="box-point">
                      <h1 class="point-text">
                        {{ this.gameStatus.player1_point }}
                      </h1>
                    </div>
                  </div>
                  <div class="box-player">
                    <div class="box-name">
                      <h5 style="margin: 0;">Player 2</h5>
                      <h3 style="margin: 10px;">
                        {{ this.gameStatus.player2_name }}
                      </h3>
                    </div>
                    <div class="box-point">
                      <h1 class="point-text">
                        {{ this.gameStatus.player2_point }}
                      </h1>
                    </div>
                  </div>
                </div>
                <div class="round-box">
                  <h4>
                    Round : {{ this.gameStatus.game_round }} | Player Turn :
                    <span style="text-weight: bold;">
                      {{ this.gameStatus.now_playing }}
                    </span>
                  </h4>
                </div>
              </div>
              <h5 v-if="currentPlayer == 'player1'">
                Your Last Choice : {{ this.gameStatus.player1_option }}
              </h5>
              <h5 v-if="currentPlayer == 'player2'">
                Your Last Choice : {{ this.gameStatus.player2_option }}
              </h5>
              <h5>Last Winner : {{ this.gameStatus.winner_option }}</h5>
              <div id="board-chooser" style="display: block !important;">
                <h5>Choose one of these option :</h5>
                <button class="btn-choose" v-on:click="setOption('scissors')">
                  <img src="./../assets/scissors.svg" width="84" /><br />
                  Scissors
                </button>
                <button class="btn-choose" v-on:click="setOption('paper')">
                  <img src="./../assets/paper.svg" width="84" /><br />
                  Paper
                </button>
                <button class="btn-choose" v-on:click="setOption('rock')">
                  <img src="./../assets/rock.svg" width="84" /><br />
                  Rock
                </button>
              </div>
            </div>
            <div id="result" style="display: none;">
              <h5>The Winner Is : {{ this.gameStatus.winner }}</h5>
              <button class="btn-restart" v-on:click="restart()">
                Restart Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import Character from "./Piplup.vue";
export default {
  name: "RPSGame",
  components: {
    Character,
  },
  data() {
    return {
      socket: {},
      context: {},
      currentPlayer: "",
      currentOption: "",
      player1: "",
      player2: "",
      gameStatus: {},
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
  },
  mounted() {
    this.socket.on("gameStatus", (data) => {
      this.gameStatus = data;
      this.player1 = this.gameStatus.player1_name;
      this.player2 = this.gameStatus.player2_name;
      if (this.gameStatus.player1_status == true) {
        document.getElementById("btnPlayer1").disabled = true;
      } else {
        document.getElementById("status").textContent = "Waiting for player";
      }
      if (this.gameStatus.player2_status == true) {
        document.getElementById("btnPlayer2").disabled = true;
      } else {
        document.getElementById("status").textContent = "Waiting for player";
      }
      if (
        this.gameStatus.player1_status == true &&
        this.gameStatus.player2_status == true
      ) {
        document.getElementById("status").textContent =
          "Lets Play (Waiting player1 to Play The Game)";
        if (this.currentPlayer == "player1") {
          document.getElementById("btnPlay").disabled = false;
        }
      }
      if (this.gameStatus.game_status == "playing") {
        document.getElementById("onplay-container").style.display = "block";
        document.getElementById("main-container").style.display = "none";
        this.playerTurn(this.gameStatus.now_playing);
      } else if (this.gameStatus.game_status == "end") {
        document.getElementById("result").style.display = "block";
        document.getElementById("board-chooser").style.display = "none";
      }
    });
  },
  methods: {
    setPlay() {
      this.socket.emit("setGameStatus", "playing");
      document.getElementById("btnPlay").disabled = true;
    },
    setPlayer(playerChoose) {
      if (playerChoose == "player1") {
        document.getElementById("btnPlayer2").disabled = true;
        document.getElementById("contPlayer1Name").style.display = "block";
        this.currentPlayer = "player1";
      }
      if (playerChoose == "player2") {
        document.getElementById("btnPlayer1").disabled = true;
        document.getElementById("contPlayer2Name").style.display = "block";
        this.currentPlayer = "player2";
      }
      this.socket.emit("setPlayer", playerChoose);
    },
    saveName(playerChoose) {
      var playerData = {
        player: playerChoose,
        name: "",
      };
      switch (playerChoose) {
        case "player1":
          playerData.name = this.player1;
          this.socket.emit("setPlayerName", playerData);
          break;
        case "player2":
          playerData.name = this.player2;
          this.socket.emit("setPlayerName", playerData);
          break;
      }
    },
    playerTurn(player) {
      document.getElementById("board-chooser").style.display = "none";
      if (player == "player1" && this.currentPlayer == "player1") {
        document.getElementById("board-chooser").style.display = "block";
      } else if (player == "player2" && this.currentPlayer == "player2") {
        document.getElementById("board-chooser").style.display = "block";
      }
    },
    setOption(option) {
      var optionData = {
        player: this.currentPlayer,
        option: option,
      };
      this.socket.emit("setOption", optionData);
      if (this.currentPlayer == "player1") {
        this.socket.emit("setNowPlaying", "player2");
        this.playerTurn("player2");
      } else if (this.currentPlayer == "player2") {
        this.socket.emit("setNowPlaying", "player1");
        this.playerTurn("player1");
      }
    },
    restart() {
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
        game_status: "not playing",
        winner: "",
      };
      this.socket.emit("resetGame", gameStatus);
      location.reload();
    },
  },
};
</script>
<style scoped>
@import "./../assets/style.css";
</style>
