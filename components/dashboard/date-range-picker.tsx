"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface CalendarDateRangePickerProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  numberOfMonths?: number
  disabled?: boolean
  className?: string
}

// Predefined date ranges
export const PREDEFINED_RANGES = {
  today: { label: "Today", days: 0 },
  yesterday: { label: "Yesterday", days: -1 },
  last7Days: { label: "Last 7 days", days: -7 },
  last30Days: { label: "Last 30 days", days: -30 },
  last90Days: { label: "Last 90 days", days: -90 },
  thisMonth: { label: "This month", days: 0 },
  lastMonth: { label: "Last month", days: -30 },
} as const

export type PredefinedRange = keyof typeof PREDEFINED_RANGES

// Helper function to create date range
export const createDateRange = (days: number): DateRange => {
  const today = new Date()
  const start = addDays(today, days)
  
  if (days === 0) {
    return { from: today, to: today }
  }
  
  return { from: start, to: today }
}

// Helper function to format date range
export const formatDateRange = (range: DateRange | undefined): string => {
  if (!range?.from) {
    return "Pick a date range"
  }
  
  if (!range.to) {
    return format(range.from, "LLL dd, y")
  }
  
  if (range.from.getTime() === range.to.getTime()) {
    return format(range.from, "LLL dd, y")
  }
  
  return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
}

// Predefined ranges component
export const PredefinedRanges: React.FC<{
  onSelect: (range: DateRange) => void
  selectedRange?: DateRange
  className?: string
}> = React.memo(({
  onSelect,
  selectedRange,
  className
}) => {
  const handleSelect = React.useCallback((days: number) => {
    const range = createDateRange(days)
    onSelect(range)
  }, [onSelect])

  const isSelected = React.useCallback((days: number) => {
    if (!selectedRange?.from || !selectedRange?.to) return false
    
    const range = createDateRange(days)
    return (
      selectedRange.from.getTime() === range.from?.getTime() &&
      selectedRange.to.getTime() === range.to?.getTime()
    )
  }, [selectedRange])

  return (
    <div className={cn("grid grid-cols-2 gap-2 p-2 border-b", className)}>
      {Object.entries(PREDEFINED_RANGES).map(([key, range]) => (
        <Button
          key={key}
          variant={isSelected(range.days) ? "default" : "ghost"}
          size="sm"
          onClick={() => handleSelect(range.days)}
          className="justify-start text-xs"
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
})

PredefinedRanges.displayName = "PredefinedRanges"

// Main component with full optimization
export const CalendarDateRangePicker: React.FC<CalendarDateRangePickerProps> = React.memo(({
  value,
  onChange,
  placeholder = "Pick a date range",
  numberOfMonths = 2,
  disabled = false,
  className,
  ...props
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  // Handle date change with memoization
  const handleSelect = React.useCallback((selectedDate: DateRange | undefined) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
  }, [onChange])

  // Handle predefined range selection
  const handlePredefinedRange = React.useCallback((range: DateRange) => {
    handleSelect(range)
  }, [handleSelect])

  // Memoized formatted date string
  const formattedDate = React.useMemo(() => {
    return formatDateRange(date)
  }, [date])

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formattedDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <PredefinedRanges 
            onSelect={handlePredefinedRange}
            selectedRange={date}
          />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
})

CalendarDateRangePicker.displayName = "CalendarDateRangePicker"

// Export all utilities and types
export { PredefinedRanges, createDateRange, formatDateRange }
export type { 
  CalendarDateRangePickerProps, 
  PredefinedRange, 
  PredefinedRangesProps 
}