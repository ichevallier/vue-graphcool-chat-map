<template>
  <div id="app">
    <google-map :username="name" />
  </div>
</template>

<script>
import generateStupidName from 'sillyname'
import GoogleMap from './components/WorldChat'

const WORLDCHAT_USERNAME_KEY = 'WORLDCHAT_USERNAME'


export default {
  name: 'App',
  data(){
    return{
      name:''
    }
  },
  mounted() {
    //this.geolocate();
    let name = localStorage.getItem(WORLDCHAT_USERNAME_KEY)
    if (!name) {
      name = generateStupidName()
      console.log('No name in localStorage, generated new: '+ name)
      localStorage.setItem(WORLDCHAT_USERNAME_KEY, name)
    }
    this.name = name
    console.log('Name in localStorage: ', name)
  },
  components: {
    GoogleMap,
    //Chat
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
