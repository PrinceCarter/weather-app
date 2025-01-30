import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full flex justify-between items-center pb-4 bg-white">
      <h1 className="text-xl font-bold text-red-500">WHETHER.IO</h1>
      <div className="flex gap-4">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost">Help</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>About Whether.IO</AlertDialogTitle>
              <AlertDialogDescription>
                Whether.IO helps you plan outdoor events by providing weather
                forecasts for specific days and times. Compare two upcoming
                days, check temperature, wind, and precipitation, and make the
                best decision for your meetup.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
