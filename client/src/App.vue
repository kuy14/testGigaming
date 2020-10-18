<template>
  <div id="app">
    <RPSGame />
  </div>
</template>

<script>
import RPSGame from "./components/RPSGame.vue";

export default {
  name: "App",
  components: {
    RPSGame,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&display=swap");
html,
body {
  font-family: "Manjari", sans-serif;
}
#app {
  font-family: "Manjari", sans-serif;
}
</style>
