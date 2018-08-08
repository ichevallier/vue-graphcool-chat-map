// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as VueGoogleMaps from "vue2-google-maps";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// For subscription
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import VueApollo from 'vue-apollo'

const serviceId = process.env.GRAPHCOOL_API;
console.log('service :: '+serviceId);

const httpLink = new HttpLink({uri: `https://api.graph.cool/simple/v1/${serviceId}` });

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: `wss://subscriptions.graph.cool/v1/${serviceId}`,
  options: {
    reconnect: true,
  },
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' &&
      operation === 'subscription'
  },
  wsLink,
  httpLink
)

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(), 
  connectToDevTools: true
})

// Install the vue plugins
Vue.use(VueGoogleMaps, {
  load: {
    key: GOOGLE_KEY,
    libraries: "places" // necessary for places input
  }
});

Vue.use(VueApollo)

Vue.config.productionTip = false


const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})


// Vue render
new Vue({
  el: '#app',
  provide: apolloProvider.provide(),
  render: h => h(App)
})
