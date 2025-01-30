import { TimeOfDay } from "./weather";

export interface WeatherCardProps {
  day: {
    date: string;
    temperature: number;
    windSpeed: number;
    precipitation: number;
    description: string;
    hourlyData: {
      time: string;
      temperature: number;
      windSpeed: number;
      precipitation: number;
    }[];
  };
  label: string;
  selectedTime: TimeOfDay;
}
