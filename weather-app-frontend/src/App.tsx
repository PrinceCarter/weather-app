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
import { WeatherDay, TimeOfDay } from "@/types/weather";
import { GET_WEATHER } from "@/queries/weather";
import { getBetterDaySuggestion } from "@/utils/suggestions";

dayjs.extend(isSameOrAfter);

export default function App() {
  const [selectedDay, setSelectedDay] = useState(dayjs().format("dddd"));
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("Afternoon");
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherDay[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [getWeather, { data, loading, error }] = useLazyQuery(GET_WEATHER, {
    fetchPolicy: "network-only",
  });

  // Prevent scrolling on initial load
  useEffect(() => {
    document.body.style.overflow = hasSearched ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [hasSearched]);

  // Detect screen size changes & reset activeIndex when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < 768;
      setIsMobile(isCurrentlyMobile);

      // Reset to show both weeks when switching to desktop
      if (!isCurrentlyMobile) {
        setActiveIndex(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load last search location from LocalStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("lastLocation");
    try {
      if (savedLocation) {
        const { lat, lon } = JSON.parse(savedLocation);
        if (lat && lon) {
          setHasSearched(true);
          setLoadingSuggestion(true);
          getWeather({ variables: { lat, lon, selectedDay } });
        }
      }
    } catch (error) {
      console.error("Error parsing saved location from localStorage:", error);
      localStorage.removeItem("lastLocation");
    }
  }, [getWeather, selectedDay]);

  // Store fetched weather data
  useEffect(() => {
    if (data?.getWeather) {
      setWeatherData(data.getWeather);
      setLoadingSuggestion(false);
    }
  }, [data]);

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
        getWeather({ variables: { lat, lon, selectedDay } });
      }
    },
    [getWeather, selectedDay]
  );

  // Extract weather for the selected day from cached data
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

  // Handle switching weeks on mobile
  const handlePrevWeek = () => setActiveIndex((prev) => Math.max(prev - 1, 0));
  const handleNextWeek = () => setActiveIndex((prev) => Math.min(prev + 1, 1));

  return (
    <div className="h-auto min-h-screen bg-white flex flex-col w-screen px-4 my-4">
      <Navbar />
      <main className="w-full flex-1 flex flex-col justify-between items-center">
        <div className="w-full bg-white min-h-screen h-auto">
          {/* Search UI */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <LocationSearch handleSearch={handleSearch} />
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

          {/* Mobile Arrows for Week Switching */}
          {hasSearched && isMobile && (
            <div className="relative flex justify-between items-center w-full mb-4">
              <Button
                variant="outline"
                className="rounded-full p-3 bg-white disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-100 transition h-12 w-12"
                onClick={handlePrevWeek}
                disabled={activeIndex === 0}
                aria-label="Previous week"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                className="rounded-full bg-white hover:bg-gray-100 transition h-12 w-12"
                onClick={handleNextWeek}
                disabled={activeIndex === 1}
                aria-label="Next week"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}

          {/* Weather Cards - Show 2 on Desktop, 1 at a time on Mobile */}
          {hasSearched && (
            <div
              className={`grid gap-4 w-full ${
                isMobile ? "grid-cols-1" : "md:grid-cols-2"
              }`}
            >
              {loading
                ? Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-300 h-48 rounded-lg"
                      ></div>
                    ))
                : selectedDaysData.map((day, index) =>
                    isMobile ? (
                      index === activeIndex ? (
                        <WeatherCard
                          key={index}
                          day={day}
                          label={index === 0 ? "This" : "Next"}
                          selectedTime={selectedTime}
                        />
                      ) : null
                    ) : (
                      <WeatherCard
                        key={index}
                        day={day}
                        label={index === 0 ? "This" : "Next"}
                        selectedTime={selectedTime}
                      />
                    )
                  )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
