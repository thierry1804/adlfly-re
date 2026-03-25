"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { labels, ...dayPickerProps } = props
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-2",
        month_caption: "flex h-10 items-center justify-between gap-2",
        caption_label: "sr-only",
        dropdowns: "flex items-center gap-2",
        dropdown_root: "relative",
        dropdown:
          "h-9 min-w-[5.5rem] appearance-none rounded-md border border-gray-300 bg-white px-3 pr-7 text-sm font-medium text-adl-navy focus:outline-none focus:ring-2 focus:ring-adl-navy focus:ring-offset-1",
        months_dropdown: "capitalize",
        years_dropdown: "min-w-[4.5rem]",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 rounded-md border-gray-300 bg-white p-0 text-adl-navy hover:bg-gray-100 hover:text-adl-navy focus-visible:ring-2 focus-visible:ring-adl-navy focus-visible:ring-offset-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 rounded-md border-gray-300 bg-white p-0 text-adl-navy hover:bg-gray-100 hover:text-adl-navy focus-visible:ring-2 focus-visible:ring-adl-navy focus-visible:ring-offset-1"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-adl-gray font-semibold uppercase text-[0.7rem] rounded-md w-10 py-1",
        week: "flex w-full mt-1",
        day: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-adl-navy/5 [&:has([aria-selected])]:bg-adl-navy/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium text-adl-navy/80 rounded-md aria-selected:opacity-100 hover:bg-adl-navy/10 hover:text-adl-navy focus-visible:ring-2 focus-visible:ring-adl-navy focus-visible:ring-offset-1"
        ),
        range_end: "day-range-end",
        selected:
          "bg-adl-navy text-white rounded-md hover:bg-adl-navy hover:text-white focus:bg-adl-navy focus:text-white",
        today: "bg-adl-navy/10 text-adl-navy font-semibold rounded-md",
        outside:
          "day-outside text-gray-300 aria-selected:bg-adl-navy/5 aria-selected:text-gray-400",
        disabled: "text-gray-300 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-adl-navy/10 aria-selected:text-adl-navy",
        hidden: "invisible",
        ...classNames,
      }}
      labels={{
        labelPrevious: () => "Mois precedent",
        labelNext: () => "Mois suivant",
        ...labels,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }: { className?: string; orientation?: "up" | "down" | "left" | "right"; size?: number; disabled?: boolean }) =>
          orientation === "right" ? <ChevronRight className={cn("h-4 w-4", className)} {...props} /> :
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
          ) : (
            <ChevronDown className={cn("h-4 w-4", className)} {...props} />
          ),
      }}
      {...dayPickerProps}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
