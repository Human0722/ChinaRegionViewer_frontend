<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
html,body {
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

/**
to show border
 */
.bordered {
  border: solid red 1px
}
</style>
