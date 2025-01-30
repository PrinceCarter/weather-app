import { useState, useEffect, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import { LocationSearch } from "@/components/LocationSearch";
import { DaySelector } from "@/components/DaySelector";
import { WeatherCard } from "@/components/WeatherCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WeatherDay } from "@/types/weather";
import { TimeOfDay } from "@/types/weather";
import { GET_WEATHER } from "@/queries/weather";
import { getBetterDaySuggestion } from "@/utils/suggestions";

dayjs.extend(isSameOrAfter);

export default function App() {
  const [location, setLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [selectedDay, setSelectedDay] = useState(dayjs().format("dddd"));
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("Afternoon");
  const [weekOffset, setWeekOffset] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const [getWeather, { data, loading, error }] = useLazyQuery(GET_WEATHER, {
    fetchPolicy: "network-only",
  });

  // Apply "overflow-hidden" when no search has been done
  useEffect(() => {
    if (!hasSearched) {
      document.body.style.overflow = "hidden"; // Prevent scrolling on mobile
    } else {
      document.body.style.overflow = "auto"; // Allow scrolling when charts exist
    }
    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, [hasSearched]);

  // Load last search location from LocalStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("lastLocation");

    try {
      if (savedLocation) {
        const parsedLocation = JSON.parse(savedLocation);

        if (parsedLocation && parsedLocation.lat && parsedLocation.lon) {
          setLocation(parsedLocation);
          setHasSearched(true);
          setLoadingSuggestion(true);
          getWeather({
            variables: {
              lat: parsedLocation.lat,
              lon: parsedLocation.lon,
              selectedDay,
              weekOffset,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error parsing saved location from localStorage:", error);
      localStorage.removeItem("lastLocation"); // Clear invalid data
    }
  }, [getWeather, selectedDay, weekOffset]);

  // Search weather based on lat/lon
  const handleSearch = useCallback(
    (lat: number, lon: number, name: string) => {
      if (lat && lon) {
        setHasSearched(true);
        setLoadingSuggestion(true);
        localStorage.setItem(
          "lastLocation",
          JSON.stringify({ name, lat, lon })
        );
        setLocation({ name, lat, lon });
        getWeather({ variables: { lat, lon, selectedDay, weekOffset } });
      }
    },
    [selectedDay, weekOffset, getWeather]
  );

  // Move forward two weeks
  const handleNextWeeks = () => {
    const newOffset = weekOffset + 2;
    setWeekOffset(newOffset);
    setLoadingSuggestion(true);
    if (location) {
      getWeather({
        variables: {
          lat: location.lat,
          lon: location.lon,
          selectedDay,
          weekOffset: newOffset,
        },
      });
    }
  };

  // Move backward two weeks (only if it does not go into the past)
  const handlePrevWeeks = () => {
    if (weekOffset > 0) {
      const newOffset = weekOffset - 2;
      setWeekOffset(newOffset);
      setLoadingSuggestion(true);
      if (location) {
        getWeather({
          variables: {
            lat: location.lat,
            lon: location.lon,
            selectedDay,
            weekOffset: newOffset,
          },
        });
      }
    }
  };

  // Ensure only the correct day of the week appears in the dataset
  const getNextTwoOccurrences = (weatherData: WeatherDay[]) => {
    const today = dayjs();
    return weatherData
      .filter((day) => {
        const dayDate = dayjs(day.date);
        return (
          dayDate.isSameOrAfter(today, "day") &&
          dayDate.format("dddd") === selectedDay
        );
      })
      .slice(0, 2);
  };

  const weatherData = data?.getWeather || [];
  const selectedDaysData = getNextTwoOccurrences(weatherData);

  // Determine the better day suggestion
  useEffect(() => {
    if (selectedDaysData.length === 2) {
      setSuggestion(
        getBetterDaySuggestion(selectedDaysData[0], selectedDaysData[1])
      );
      setLoadingSuggestion(false);
    }
  }, [selectedDaysData]);

  return (
    <div className="h-auto min-h-screen bg-white flex flex-col w-screen px-4 my-4">
      <Navbar />
      <main className="w-full flex-1 flex flex-col justify-between items-center">
        <div className="w-full bg-white min-h-screen h-auto flex flex-col justify-between">
          {/* Search UI */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <LocationSearch
              setLocation={setLocation}
              handleSearch={handleSearch}
            />
            <DaySelector
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </div>

          {error && <p className="text-red-500">Error fetching weather data</p>}

          {/* Suggestion Section */}
          {hasSearched && (
            <Alert className="mb-4 w-full">
              {loadingSuggestion ? (
                <div className="space-y-2">
                  <div className="animate-pulse h-5 bg-gray-300 w-1/3 rounded"></div>
                  <div className="animate-pulse h-4 bg-gray-300 w-3/4 rounded"></div>
                </div>
              ) : (
                <>
                  <AlertTitle>Weather Suggestion</AlertTitle>
                  <AlertDescription>{suggestion}</AlertDescription>
                </>
              )}
            </Alert>
          )}

          {/* Arrows Container - Moved Below Suggestion */}
          {hasSearched && (
            <div className="relative flex justify-between items-center w-full mb-4">
              <Button
                variant="outline"
                className="rounded-full p-3 bg-white disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-100 transition h-12 w-12"
                onClick={handlePrevWeeks}
                disabled={weekOffset === 0}
                aria-label="Previous weeks"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                className="rounded-full bg-white hover:bg-gray-100 transition h-12 w-12"
                onClick={handleNextWeeks}
                aria-label="Next weeks"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}

          {/* Weather Cards */}
          {hasSearched && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full flex-grow">
              {loading
                ? Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-300 h-48 rounded-lg"
                      ></div>
                    ))
                : selectedDaysData.map((day, index) => (
                    <WeatherCard
                      key={index}
                      day={day}
                      label={
                        weekOffset === 0 ? (index === 0 ? "This" : "Next") : ""
                      }
                      selectedTime={selectedTime}
                    />
                  ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
