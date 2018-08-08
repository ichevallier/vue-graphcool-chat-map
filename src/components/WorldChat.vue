<template>
  <div>
    <gmap-map
      :center="center"
      :zoom="12"
      style="width:100%;height:800px;"
    >
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
        {{infoContent}}
      </gmap-info-window>
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true" @click="toggleInfoWindow(m,index)"

      ></gmap-marker>
    </gmap-map>
    <chat />
    <!-- <chat :travellerId="travellerId" /> -->
  </div>
</template>

<script>
import Chat from './Chat'
import gql from 'graphql-tag'
import { allLocations, travellerForId, createLocationAndTraveller, updateLocation, newLocationSubscription} from '../graphql'


const WORLDCHAT_USER_ID_KEY = 'WORLDCHAT_USER_ID'

export default {
  name: "GoogleMap",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
      travellerId: undefined,
      infoContent: '',
      infoWindowPos: null,
      infoWinOpen: false,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      locations:[],
      travellerWithId:[]
    };
  },
  props: ['username'],
  mounted() {
    this.geolocateTraveller();
    //this.getLocalStorageItem();
  },
  apollo: {
    markers: {
      query:allLocations,
      update (data) {
        // something updated
      },
      subscribeToMore: [
      {
        document:newLocationSubscription,
        // Mutate the previous result
        updateQuery:(previous, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          const newAllLocations = [
            subscriptionData.data.Location.node,
            ...previous.markers
          ]
          const result = {
            ...previous,
            markers: newAllocations//markers: newAllLocations.slice(0, 5)
          }
          return result
        }
      }],
      result(data) {
        const theNewMarkers = [];
        data.data.allLocations.map(function (node) {
          const newMarkers = {
            lat: node.latitude,
            lng: node.longitude
          };
          theNewMarkers.push({ position: newMarkers,infoText:node.traveller.name });
        })
        this.markers = theNewMarkers
      },
    },
    Traveller:{
      query:travellerForId,
      variables() {
        return {
          id: this.travellerId
        }
      },
      // Disable the query
      skip() {
        return this.skipQuery
      },
      result(data) {
        this.travellerWithId = data.data.Traveller;
        //console.log("check traveller")
      }

    }

  },
  methods: {
    getLocalStorageItem: function(){
      console.log("key : "+localStorage.getItem('WORLDCHAT_USERNAME'))
    },
    geolocateTraveller: function() {
      this.$apollo.queries.Traveller.skip = true;
    
      navigator.geolocation.getCurrentPosition(position => {
        // add location and name into marker
        const marker = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.markers.push({ position: marker,infoText:this.username });
        this.center = marker;

        // Test
        //const travellerIdConst = 'cjiblpevdyba80174xgfylupw';
        //localStorage.setItem(WORLDCHAT_USER_ID_KEY,travellerIdConst);
        const travellerIdConst = localStorage.getItem(WORLDCHAT_USER_ID_KEY)
        this.travellerId = travellerIdConst;

        // Check if traveller already exists
        if (!Boolean(travellerIdConst)) {
          console.log('create new traveller :: '+this.username)
          this.createNewTraveller(position.coords.latitude,position.coords.longitude)
        }else{
          console.log('update traveller :: '+this.username)
          this.updateExistingTraveller(travellerIdConst)
        }
      });

    },
    createNewTraveller: function(lat,lng) {
      console.log(lat+' / '+lng)
      this.$apollo.mutate({
        mutation:createLocationAndTraveller,
        variables:{
          name:this.username,
          latitude:lat,
          longitude:lng
        },
        update: (store, { data: { createLocation } }) => {
          const data = store.readQuery({
          query: allLocations,
          })
          data.allLocations.push(createLocation)
          store.writeQuery({
            query: allLocations,
            data
          })
        },
      }).then((data) => {
        localStorage.setItem(WORLDCHAT_USER_ID_KEY,data.data.createLocation.traveller.id)
      }).catch((error) => {
        console.error(error)
        //this.newMessage = newMessage
      })
      
    },
    updateExistingTraveller:function(travellerId){

      // Check for traveller with this Id
      this.$apollo.queries.Traveller.skip = false;
      this.$apollo.queries.Traveller.refetch();
      //console.log("location Id "+this.travellerWithId.location.id);

      // and then we update the traveller data

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.$apollo.mutate({
            mutation:updateLocation,
            variables:{
              locationId:this.travellerWithId.location.id,
              latitude:position.coords.latitude,
              longitude:position.coords.longitude
            },
            update: (store, { data: { updateLocation } }) => {
              // read data from cache for this query
              const data = store.readQuery({ query: allLocations })
              // update location from the mutation to existing locations
              data.allPosts.push(addPost)
              // write data back to the cache
              store.writeQuery({ query: allLocations, data })
            },
          }).then((data) => {
            console.log(data.data)
          }).catch((error) => {
            console.error(error)
          })
        })
      }
    },
    generateRandomNorthPolePosition:function(){
      const latitude = 64.7555869
      const longitude = -147.34432909999998
      const latitudeAdd = Math.random() > 0.5
      const longitudeAdd = Math.random() > 0.5
      const latitudeDelta = Math.random() * 3
      const longitudeDelta = Math.random() * 3
      const newLatitude = latitudeAdd ? latitude + latitudeDelta : latitude - latitudeDelta
      const newLongitude = longitudeAdd ? longitude + longitudeDelta : longitude - longitudeDelta
      return {latitude: newLatitude, longitude: newLongitude}
    },
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = marker.infoText;
      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    }
  },
  components: {
    Chat,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.WorldChat {
    width: 100%;
    height: 100%;
    background-color: red;
}

.MarkerInfoWindow {
    border-radius: 2px;
    border-width: 1px;
    border-color: rgba(0,89,33,1);
    background-color: rgba(39,174,96,1);
    color: white;
}

</style>
