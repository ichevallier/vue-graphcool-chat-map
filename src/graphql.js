import gql from 'graphql-tag'

// worldChat
export const allLocations = gql`
  query allLocations {
    allLocations {
      id
      latitude
      longitude
      traveller {
        id
        name
      }
    }
  }
`

export const travellerForId = gql`
  query travellerForId($id: ID!) {
    Traveller(id: $id) {
      id
      name
      location {
        id
        latitude
        longitude
      }
    }
  }
`

export const createLocationAndTraveller = gql`
    mutation createLocationAndTraveller($name: String!, $latitude: Float!, $longitude: Float!) {
        createLocation(latitude: $latitude, longitude: $longitude, traveller: {
            name: $name
        }) {
            id
            latitude
            longitude
            traveller {
                id
                name
            }
        }
    }
`

export const updateLocation = gql`
  mutation updateLocation($locationId: ID!, $latitude: Float!, $longitude: Float!) {
    updateLocation(id: $locationId, latitude: $latitude, longitude: $longitude) {
      traveller {
        id
        name
      }
      id
      latitude
      longitude
    }
  }
`

export const newLocationSubscription = gql`
        subscription {
          Location(filter: {
              mutation_in: [CREATED, UPDATED]
          }) {
            mutation
            node {
              id
              latitude
              longitude
              traveller {
                id
                name
              }
            }
          }
        }
      `
// chat
export const allMessagesGql = gql`
  query allMessages {
    allMessages(last: 100) {
      id
      text
      createdAt
      sentBy {
        id
        name
      }
    }
  }
`

export const newMessageSubscription = gql`
  subscription {
    Message(filter: {
        mutation_in: [CREATED]
    }) {
      node {
        id
        text
        createdAt
        sentBy {
          id
          name
        }
      }
    }
  }
`
// chat Input
export const createMessageGql = gql`
  mutation createMessage($text: String!, $sentById: ID!) {
    createMessage(text: $text, sentById: $sentById) {
      id
      text
      sentBy {
        id
        name
      }
    }
  }
`
// traveller Count
export const allTravellersCount = gql`
    query allTravellersCount {
        _allTravellersMeta {
            count
        }
    }
`