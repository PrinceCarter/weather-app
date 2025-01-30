import axios from "axios";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

interface WeatherData {
  datetime: string;
  temp: number;
  windspeed: number;
  humidity: number;
  precip: number;
  precipprob: number;
  conditions: string;
  hours: {
    datetime: string;
    temp: number;
    windspeed: number;
    humidity: number;
    precip: number;
    precipprob: number;
  }[];
}

// Map weekdays to numbers (0 = Sunday, 6 = Saturday)
const weekdayMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const resolvers = {
  Query: {
    getWeather: async (
      _: any,
      {
        lat,
        lon,
        selectedDay,
        weekOffset,
      }: { lat: number; lon: number; selectedDay: string; weekOffset: number }
    ) => {
      try {
        // Calculate the next occurrence of the selected weekday
        const today = dayjs();
        const targetDayIndex = weekdayMap[selectedDay];
        let daysToAdd = (targetDayIndex + 7 - today.day()) % 7;

        // If today is the selected day and it's the current week, use today
        if (daysToAdd === 0 && weekOffset === 0) {
          daysToAdd = 0;
        } else {
          daysToAdd += weekOffset * 7;
        }

        const startDate = today.add(daysToAdd, "day").format("YYYY-MM-DD");
        const endDate = dayjs(startDate).add(7, "day").format("YYYY-MM-DD");

        const response = await axios.get(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${startDate}/${endDate}?unitGroup=us&include=hours&key=${process.env.VISUAL_CROSSING_API_KEY}`
        );

        if (!response.data?.days || !Array.isArray(response.data.days)) {
          console.error("Unexpected API response:", response.data);
          return [];
        }

        return response.data.days.map((day: WeatherData) => ({
          date: day.datetime,
          dayOfWeek: dayjs(day.datetime).format("dddd"),
          temperature: day.temp,
          windSpeed: day.windspeed,
          humidity: day.humidity,
          precipitation: day.precip,
          precipitationProbability: day.precipprob,
          description: day.conditions,
          hourlyData: Array.isArray(day.hours)
            ? day.hours.map((hour) => ({
                time: hour.datetime,
                temperature: hour.temp,
                windSpeed: hour.windspeed,
                humidity: hour.humidity,
                precipitation: hour.precip,
                precipitationProbability: hour.precipprob,
              }))
            : [],
        }));
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return [];
      }
    },
    getLocationSuggestions: async (_: any, { input }: { input: string }) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
          {
            params: {
              input,
              types: "geocode",
              key: process.env.GOOGLE_MAPS_API_KEY,
            },
          }
        );

        return response.data.predictions.map((place: any) => ({
          description: place.description,
          placeId: place.place_id,
        }));
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        throw new Error("Failed to fetch location suggestions");
      }
    },
    getLocationDetails: async (_: any, { placeId }: { placeId: string }) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: { place_id: placeId, key: process.env.GOOGLE_MAPS_API_KEY },
          }
        );

        const location = response.data.results[0]?.geometry?.location;
        if (!location) {
          throw new Error("Location not found");
        }

        return {
          lat: location.lat,
          lon: location.lng,
          address: response.data.results[0]?.formatted_address || "",
        };
      } catch (error) {
        console.error("Error fetching location details:", error);
        throw new Error("Failed to fetch location details");
      }
    },
  },
};
