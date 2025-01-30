import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  annotationPlugin
);

interface HourlyData {
  time: string;
  temperature: number;
  precipitation: number;
  windSpeed: number;
}

type TimeOfDay = "Morning" | "Afternoon" | "Evening";

interface WeatherChartProps {
  hourlyData: HourlyData[];
  date: string;
  selectedTime: TimeOfDay;
}

const timeRanges: Record<TimeOfDay, [string, string]> = {
  Morning: ["06:00:00", "12:00:00"],
  Afternoon: ["12:00:00", "18:00:00"],
  Evening: ["18:00:00", "23:59:59"],
};

export function WeatherChart({
  hourlyData,
  date,
  selectedTime,
}: WeatherChartProps) {
  if (!hourlyData || hourlyData.length === 0)
    return (
      <Alert variant="destructive" className="w-fit mt-4">
        {/* <AlertCircle className="h-4 w-4" /> */}
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Hourly chart data not available for this week.
        </AlertDescription>
      </Alert>
    );

  // Convert time to JS Date object (ensure proper format)
  const formattedData = hourlyData
    .map((hour) => {
      const timestamp = dayjs(
        `${date} ${hour.time}`,
        "YYYY-MM-DD HH:mm:ss"
      ).toDate();
      return {
        x: timestamp,
        temperature: hour.temperature,
        precipitation: hour.precipitation,
        windSpeed: hour.windSpeed,
      };
    })
    .filter((data) => !isNaN(data.x.getTime())); // Ensure valid timestamps

  if (formattedData.length === 0) return <p>No valid data available</p>;

  // Get start and end times for the selected period
  const [start, end] = timeRanges[selectedTime] || [];
  const highlightStart = dayjs(
    `${date} ${start}`,
    "YYYY-MM-DD HH:mm:ss"
  ).toDate();
  const highlightEnd = dayjs(`${date} ${end}`, "YYYY-MM-DD HH:mm:ss").toDate();

  // Ensure highlight range is within data range
  const minX = formattedData[0].x;
  const maxX = formattedData[formattedData.length - 1].x;
  const validHighlightStart =
    highlightStart >= minX && highlightStart <= maxX ? highlightStart : minX;
  const validHighlightEnd =
    highlightEnd >= minX && highlightEnd <= maxX ? highlightEnd : maxX;

  const weatherData = {
    datasets: [
      {
        label: "Temperature (°F)",
        data: formattedData.map((d) => ({ x: d.x, y: d.temperature })),
        borderColor: "#f87171",
        backgroundColor: "rgba(248, 113, 113, 0.2)",
        tension: 0.4,
      },
      {
        label: "Precipitation (in)",
        data: formattedData.map((d) => ({ x: d.x, y: d.precipitation })),
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96, 165, 250, 0.2)",
        tension: 0.4,
      },
      {
        label: "Wind Speed (mph)",
        data: formattedData.map((d) => ({ x: d.x, y: d.windSpeed })),
        borderColor: "#34d399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: `Hourly Weather for ${dayjs(date).format("dddd, MMM D")}`,
        font: { size: 16 },
      },
      annotation: {
        annotations: {
          highlightArea: {
            type: "box" as const,
            xMin: validHighlightStart.getTime(),
            xMax: validHighlightEnd.getTime(),
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw" as const,
            yScaleID: "y",
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "hour" as const,
          displayFormats: { hour: "hh:mm a" },
          tooltipFormat: "hh:mm a",
        },
        grid: { display: false },
      },
      y: {
        grid: { display: true },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={weatherData} options={options} />
    </div>
  );
}
