<template>
  <div class="Container">
    <div class="TravellerCount">
      <img class="TravellerCountIcon" alt="traveller" src="../assets/travellers.svg" />
    
      <div class='TravellerCountNumber'>{{allTravellers}}</div>
      <div class='TravellerCountText'>travellers were here</div>
    </div>
  </div>
</template>

<script>

import gql from 'graphql-tag'
import allTravellersCount from '../graphql'

export default {
 // Local state
  /*data: () => ({
    allTravellers: {},
    loading: 0,
  }),*/
data(){
  return {
    allTravellers:{},
    //loading:0,
  }
},
  // Apollo GraphQL
  apollo: {
    allTravellers: {
      query: gql`{_allTravellersMeta {count} }`,//allTravellersCount,
      update: ({ _allTravellersMeta }) => _allTravellersMeta.count
      //loadingKey: 'loading',
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Container {
    height: 100px;
    background-color: white;
}

.LoadingContainer {
    height: 100px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(0,0,0,.5);
}

.TravellerCount {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(0,0,0,.5);
    height: 90%;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    margin: 0 20px 0 20px;
    border-bottom-color: rgba(0,0,0,.1);
}

.TravellerCountIcon {
    margin-right: 12px;
}


.TravellerCountText {
    font-weight: 300;
    color: rgba(0,0,0,.5);
}

.TravellerCountNumber {
    font-weight: 600;
    color: rgba(0,0,0,.5);
    margin-right: 6px;
}
</style>
