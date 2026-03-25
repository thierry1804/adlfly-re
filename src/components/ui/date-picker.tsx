"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const MONTHS_FR = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
]
const DAYS_FR = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

interface DatePickerProps {
  value?: Date
  onChange: (date: Date) => void
  minDate?: Date
  label: string
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({ value, onChange, minDate, label, placeholder = "Choisir", disabled = false }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => (value ?? new Date()).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => (value ?? new Date()).getMonth())
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Sync view to value when opened
  useEffect(() => {
    if (open && value) {
      setViewYear(value.getFullYear())
      setViewMonth(value.getMonth())
    }
  }, [open, value])

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }, [viewMonth])

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }, [viewMonth])

  const today = startOfDay(new Date())
  const min = minDate ? startOfDay(minDate) : today
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1)
  const trailingDays = Array.from({ length: firstDay }, (_, i) => ({
    day: prevMonthDays - firstDay + 1 + i,
    outside: true,
    date: new Date(viewYear, viewMonth - 1, prevMonthDays - firstDay + 1 + i),
  }))

  // Current month days
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    outside: false,
    date: new Date(viewYear, viewMonth, i + 1),
  }))

  // Next month leading days
  const totalCells = trailingDays.length + currentDays.length
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  const leadingDays = Array.from({ length: remaining }, (_, i) => ({
    day: i + 1,
    outside: true,
    date: new Date(viewYear, viewMonth + 1, i + 1),
  }))

  const allDays = [...trailingDays, ...currentDays, ...leadingDays]
  const weeks: typeof allDays[] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  const formatTrigger = (d: Date) => {
    const days = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]
    const months = ["jan.", "fev.", "mars", "avr.", "mai", "juin", "juil.", "aout", "sept.", "oct.", "nov.", "dec."]
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "h-14 w-full overflow-hidden bg-white border border-gray-200 text-adl-navy hover:bg-gray-50 rounded-lg relative pl-10 pr-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          open && "ring-2 ring-adl-navy border-adl-navy"
        )}
      >
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-adl-gray" />
        {value ? (
          <div className="flex h-full items-center min-w-0">
            <span className="block w-full truncate whitespace-nowrap text-sm font-semibold text-adl-navy capitalize">
              {formatTrigger(value)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-adl-gray/70 truncate">{placeholder}</span>
        )}
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-30 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 w-[310px] select-none animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-adl-navy hover:bg-adl-navy/10 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-adl-navy capitalize">
              {MONTHS_FR[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-adl-navy hover:bg-adl-navy/10 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 px-3">
            {DAYS_FR.map((d) => (
              <div key={d} className="h-8 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider text-adl-gray/60">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="px-3 pb-4">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((cell, di) => {
                  const isDisabled = cell.date < min
                  const isSelected = value && isSameDay(cell.date, value)
                  const isToday = isSameDay(cell.date, today)

                  return (
                    <button
                      key={di}
                      type="button"
                      disabled={isDisabled || cell.outside}
                      onClick={() => {
                        onChange(cell.date)
                        setOpen(false)
                      }}
                      className={cn(
                        "h-10 w-10 mx-auto rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center",
                        cell.outside && "text-gray-200 cursor-default",
                        !cell.outside && !isDisabled && !isSelected && "text-adl-navy hover:bg-adl-navy/10 hover:scale-105 active:scale-95",
                        !cell.outside && isDisabled && "text-gray-300 cursor-not-allowed",
                        isToday && !isSelected && !cell.outside && "bg-adl-sky/15 font-bold",
                        isSelected && "bg-adl-navy text-white font-bold shadow-md hover:bg-adl-navy"
                      )}
                    >
                      {cell.day}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const d = today < min ? min : today
                onChange(d)
                setViewYear(d.getFullYear())
                setViewMonth(d.getMonth())
                setOpen(false)
              }}
              className="text-xs font-bold text-adl-sky hover:underline"
            >
              Aujourd&apos;hui
            </button>
            {value && (
              <span className="text-xs text-adl-gray capitalize">
                {formatTrigger(value)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
