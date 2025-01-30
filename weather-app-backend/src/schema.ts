import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type LocationSuggestion {
    description: String
    placeId: String
  }

  type LocationDetails {
    lat: Float!
    lon: Float!
    address: String!
  }

  type HourlyWeather {
    time: String
    temperature: Float
    windSpeed: Float
    humidity: Float
    precipitation: Float
    precipitationProbability: Float
  }

  type Weather {
    date: String
    dayOfWeek: String
    temperature: Float
    windSpeed: Float
    humidity: Float
    precipitation: Float
    precipitationProbability: Float
    description: String
    hourlyData: [HourlyWeather]
  }

  type Query {
    getWeather(
      lat: Float!
      lon: Float!
      selectedDay: String!
      weekOffset: Int!
    ): [Weather]
    getLocationSuggestions(input: String!): [LocationSuggestion]
    getLocationDetails(placeId: String!): LocationDetails
  }
`;
