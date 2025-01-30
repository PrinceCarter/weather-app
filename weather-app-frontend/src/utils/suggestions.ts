import { WeatherDay } from "@/types/weather";

/* Helper function to determine which day is better */
export function getBetterDaySuggestion(day1: WeatherDay, day2: WeatherDay) {
  const rainDifference = Math.abs(day1.precipitation - day2.precipitation);
  const windDifference = Math.abs(day1.windSpeed - day2.windSpeed);
  const tempDifference = Math.abs(day1.temperature - day2.temperature);

  // Prioritize precipitation first
  if (rainDifference > 0.1) {
    return day1.precipitation < day2.precipitation
      ? `🌧️ This ${day1.dayOfWeek} has less rain! It seems like a better choice.`
      : `🌧️ Next ${day2.dayOfWeek} is drier! Consider this one.`;
  }

  // Then wind speed if precipitation is similar
  if (windDifference > 5) {
    return day1.windSpeed < day2.windSpeed
      ? `💨 This ${day1.dayOfWeek} is less windy. It seems like it might be more comfortable!`
      : `💨 Next ${day2.dayOfWeek} is less windy.`;
  }

  // If precipitation and wind are similar, consider temperature
  if (tempDifference > 5) {
    return day1.temperature > day2.temperature
      ? `🌡️ This ${day1.dayOfWeek} is warmer! Seems like a good day for outdoor plans.`
      : `🌡️ Next ${day2.dayOfWeek} is warmer! It seems like it might be more pleasant.`;
  }

  // If all factors are similar
  return `✅ Both days have similar weather. Pick whichever fits your schedule best!`;
}
