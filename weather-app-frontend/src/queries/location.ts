import { gql } from "@apollo/client";

export const GET_LOCATION_SUGGESTIONS = gql`
  query GetLocationSuggestions($input: String!) {
    getLocationSuggestions(input: $input) {
      description
      placeId
    }
  }
`;

export const GET_LOCATION_DETAILS = gql`
  query GetLocationDetails($placeId: String!) {
    getLocationDetails(placeId: $placeId) {
      lat
      lon
      address
    }
  }
`;
