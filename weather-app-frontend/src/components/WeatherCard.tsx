import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WeatherChart } from "@/components/WeatherChart";
import { WeatherCardProps } from "@/types/components";
import dayjs from "dayjs";

export function WeatherCard({ day, label, selectedTime }: WeatherCardProps) {
  return (
    <Card className="w-full shadow-none">
      <CardHeader className="gap-1">
        <CardTitle className="text-red-500 text-2xl">
          {label} {dayjs(day.date).format("dddd, MMM D")}
        </CardTitle>
        <Badge variant="outline" className="w-fit mb-2">
          {day.description}
        </Badge>
        <div className="flex items-center gap-2 text-gray-600">
          <p className="text-sm">🌡 {day.temperature}°F</p>
          <Separator orientation="vertical" className="h-5" />
          <p className="text-sm">💨 {day.windSpeed} mph</p>
          <Separator orientation="vertical" className="h-5" />
          <p className="text-sm">🌧 {day.precipitation} in</p>
        </div>
      </CardHeader>
      <CardContent>
        <WeatherChart
          hourlyData={day.hourlyData}
          date={day.date}
          selectedTime={selectedTime}
        />
      </CardContent>
    </Card>
  );
}
