import { gql } from "@apollo/client";

export const GET_WEATHER = gql`
  query GetWeather(
    $lat: Float!
    $lon: Float!
    $selectedDay: String!
    $weekOffset: Int!
  ) {
    getWeather(
      lat: $lat
      lon: $lon
      selectedDay: $selectedDay
      weekOffset: $weekOffset
    ) {
      date
      dayOfWeek
      temperature
      windSpeed
      humidity
      precipitation
      precipitationProbability
      description
      hourlyData {
        time
        temperature
        windSpeed
        humidity
        precipitation
        precipitationProbability
      }
    }
  }
`;
