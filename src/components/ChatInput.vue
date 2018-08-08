<template>
  <div className='ChatInput'>

        <input
          class='InputField'
          placeholder='Entrer votre message...'
          type='text'
          v-model="message"
          v-on:keyup.enter="createMessageEnter"
        />
        
      </div>
</template>

<script>
import gql from 'graphql-tag'
import { allMessagesGql, createMessageGql } from '../graphql'

export default {
  name: 'ChatInput',
  data () {
    return {
      message:''
    }
  },
  //props: ['travellerId'],
  methods:{
    /*changement: function(e){
      //alert(message)
      if (e.keyCode === 13) {
        alert('Enter was pressed');
      } else if (e.keyCode === 50) {
        alert('@ was pressed');
      }      
      //this.log += e.key;
      alert(e.key);
    },*/
    createMessageEnter: function() {
      console.log("on enter event : "+this.message);
      const newMessage = this.message
      console.log('message : '+newMessage)
      /*
      const sentById = localStorage.getItem(GC_USER_ID)
      if (!sentById) {
        console.error('No user logged in')
        return
      }
      */
      //console.log('travellerId:: '+this.travellerId);
      
      /*if (!Boolean(this.travellerId)) {
        const sentById = this.travellerId;
      }else{
        const sentById = 'cjhad6t7kdzd90103dju5z69n';
      }*/
      const sentById = localStorage.getItem('WORLDCHAT_USER_ID')
      //const sentById = 'cjiblpevdyba80174xgfylupw';
      //const sentById = this.travellerId;
      console.log('sent by '+sentById);

      this.$apollo.mutate({
        mutation: createMessageGql,
        variables: {
          text: newMessage,
          sentById
        },
        update: (store, { data: { createMessage } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: allMessagesGql,
          })
          // Add our message from the mutation to the end
          data.allMessages.push(createMessage)
          //console.log(data);
          // Write our data back to the cache.
          // problem duplicated key and this may cause an update error. So I comment it
          /*store.writeQuery({
            query: allMessagesGql,
            data
          })*/
          /*.then((data) => {
            // some actions.... 
          }).catch((error) => {
            console.error(error)
            this.newMessage = newMessage
          })*/
        },
        // Optimistic UI
        // Will be treated as a 'fake' result as soon as the request is made
        // so that the UI can react quickly and the user be happy
        /*optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            id: -1,
            text: newMessage,
            sentById
          },
        },*/
        //
      }).then((data) => {
        // some actions....
        //console.log(data)
        console.log('message id : '+data.data.createMessage.id)
      }).catch((error) => {
        console.error(error)
        this.newMessage = newMessage
      })
      this.message = '';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ChatInput {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 62px;
    border-radius: 2px;
    -webkit-background-size:;
    margin-bottom: 50px;
}

.InputField {
    width: 100%;
    height: 100%;
    padding: 25px 25px 25px 25px;
    word-break: break-word;
    border:none;
    background-color: rgba(229, 229, 229, 1);
    font-size: 14px;
    font-weight: 300;
    color: rgba(0,0,0,.6);
    border-radius: 2px;
}

*:focus {
    outline: none;
}

</style>
