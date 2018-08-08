<template>
  <div class='Chat'>
    <traveller-count />
    <div class="ChatMessages">
      <chat-msg
        v-for="post in allMessages"
        :key="post.id"
        :post="post" :time="post.createdAt">
      </chat-msg>
      <chat-input :message="message" />
     <!--  <chat-input :message="message" :travellerId="travellerId" /> -->
    </div>
  </div>
</template>

<script>
import ChatInput from './ChatInput'
import ChatMsg from './ChatMsg'
import TravellerCount from './TravellerCount'
import gql from 'graphql-tag'
import { allMessagesGql, newMessageSubscription } from '../graphql'

export default {
 // Local state
  data: () => ({
    allMessages: {},
    loading: 0,
    message:''
  }),
  //props: ['travellerId'],
  // Apollo GraphQL
  apollo: {
    allMessages: {
      query: allMessagesGql,
      loadingKey: 'loading',
      update (data) {
        //this.count = data._allLinksMeta.count
        return data.allMessages
      },
      subscribeToMore: [
      {
        document: newMessageSubscription,
        // Mutate the previous result
        updateQuery: (previous, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          const newAllMessages = [
            subscriptionData.data.Message.node,
            ...previous.allMessages
          ]

          const result = {
            ...previous,
            //allMessages: newAllMessages.slice(0, 5)
            allMessages: newAllMessages
          }
          //console.log('result'+result[0])
          return result
        }
      }],
    },
  },
  components: {
    ChatMsg,
    ChatInput,
    TravellerCount
  },
  mounted(){
    console.log(`Chat - componentDidMount`)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  left: 65%;
  right: 20px;
  top: 20px;
  bottom: 20px;
  border-radius: 2px;
  box-shadow: 0 0 4px rgba(0,0,0,.2);
}
.ChatMessages {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 2px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}
</style>
