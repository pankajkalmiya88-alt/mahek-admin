import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 pb-2 relative items-center mb-2",
        caption_label: "text-base font-semibold",
        caption_dropdowns: "flex gap-2 justify-center items-center",
        dropdown_month: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer",
        dropdown_year: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer",
        dropdown: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white p-0 hover:bg-gray-100 border-gray-300 transition-colors"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse mt-2",
        head_row: "flex mb-1",
        head_cell:
          "text-gray-600 rounded-md w-10 font-semibold text-xs uppercase",
        row: "flex w-full mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
        day_today: "bg-gray-100 text-gray-900 font-semibold",
        day_outside:
          "day-outside text-gray-400 opacity-60 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

