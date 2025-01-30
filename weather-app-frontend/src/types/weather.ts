export interface WeatherDay {
  date: string;
  dayOfWeek: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  description: string;
  hourlyData: {
    time: string;
    temperature: number;
    windSpeed: number;
    humidity: number;
    precipitation: number;
    precipitationProbability: number;
  }[];
}

export type TimeOfDay = "Morning" | "Afternoon" | "Evening";
