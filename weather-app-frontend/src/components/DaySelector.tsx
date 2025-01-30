import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TimeOfDay } from "@/types/weather";

interface DaySelectorProps {
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  selectedTime: TimeOfDay;
  setSelectedTime: (value: TimeOfDay) => void;
}

export function DaySelector({
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
}: DaySelectorProps) {
  return (
    <div className="flex gap-4">
      <Select onValueChange={setSelectedDay} defaultValue={selectedDay}>
        <SelectTrigger className="w-40 shadow-none text-lg py-5">
          <SelectValue placeholder="Select Day">{selectedDay}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <SelectItem className="text-lg" key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setSelectedTime} defaultValue={selectedTime}>
        <SelectTrigger className="w-40 shadow-none text-lg py-5">
          <SelectValue placeholder="Select Time">{selectedTime}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="text-lg" value="Morning">
            Morning
          </SelectItem>
          <SelectItem className="text-lg" value="Afternoon">
            Afternoon
          </SelectItem>
          <SelectItem className="text-lg" value="Evening">
            Evening
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
