<template>
  <div class="chatMessage">
    <div class='MessageHeader'>
      <div class='Username'>{{username}} ({{since}})</div>
    </div>
    <div class='Message'>{{post.text}}</div>
  </div>
</template>

<script>
import {timeDifference} from '../utils'
export default {
  name: 'ChatMsg',
  props: ['post','time'],
  computed: {
    since: function () {
      const createdAtTimestamp = new Date(this.time).getTime()
      const nowTimestamp = new Date().getTime()
      const ago = timeDifference(nowTimestamp, createdAtTimestamp)
      return ago //return nowTimestamp
      //return this.size.trim().toLowerCase()
    },
    username:function(){
      return this.post.sentBy.name.toUpperCase()
    }
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ChatMessage {
    margin: 0 16px 16px 16px;
}

.MessageHeader {
    display: flex;
    flex-direction: row;
}

.Username {
    font-size: 10px;
    color: rgba(0,0,0,.3);
    /* color:red; */
    font-weight: 600;
}

.Time {
    margin-left: 6px;
    font-size: 10px;
    color: rgba(0,0,0,.3);
    font-weight: 300;
}

.Message {
    display: flex;
    align-items: center;
    border-radius: 2px;
    background-color: rgba(39,174,96,1);
    color: white;
    font-size: 13px;
    font-weight: 400;
    margin-top: 6px;
    padding: 16px 16px 16px 16px;

}
</style>
