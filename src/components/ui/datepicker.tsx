import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Input } from "./input"

// DayPicker 스타일링을 위한 CSS 클래스
const dayPickerStyles = `
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #3b82f6;
    --rdp-background-color: #f8fafc;
    --rdp-outline: 2px solid var(--rdp-accent-color);
    --rdp-outline-selected: 2px solid #1e40af;
  }

  .rdp-months {
    display: flex;
  }

  .rdp-month {
    margin: 0 8px;
  }

  .rdp-table {
    width: 100%;
    max-width: 300px;
    border-collapse: collapse;
  }

  .rdp-head_row,
  .rdp-row {
    height: 40px;
  }

  .rdp-head_cell {
    font-weight: 500;
    font-size: 0.875rem;
    color: #64748b;
    padding: 0;
    text-align: center;
  }

  .rdp-cell {
    text-align: center;
    position: relative;
    padding: 0;
  }

  .rdp-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--rdp-cell-size);
    height: var(--rdp-cell-size);
    border: none;
    background: none;
    font-size: 0.875rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .rdp-button:hover:not(.rdp-button_selected):not(.rdp-button_disabled) {
    background-color: var(--rdp-background-color);
  }

  .rdp-button_selected {
    background-color: var(--rdp-accent-color);
    color: white;
  }

  .rdp-button_disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .rdp-button_today:not(.rdp-button_selected) {
    background-color: #fef3c7;
    color: #92400e;
  }

  .rdp-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .rdp-nav_button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .rdp-nav_button:hover {
    background-color: #f8fafc;
  }

  .rdp-caption_label {
    font-weight: 600;
    font-size: 1rem;
    color: #1e293b;
  }
`

// 스타일을 head에 주입
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = dayPickerStyles
  document.head.appendChild(styleElement)
}

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ date, onDateChange, placeholder = "날짜를 선택하세요", disabled, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (date) {
        setInputValue(format(date, "yyyy-MM-dd", { locale: ko }))
      } else {
        setInputValue("")
      }
    }, [date])

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)

      // 날짜 형식 검증 (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (dateRegex.test(value)) {
        const parsedDate = new Date(value)
        if (!isNaN(parsedDate.getTime())) {
          onDateChange?.(parsedDate)
        }
      }
    }

    const handleDateSelect = (selectedDate: Date | undefined) => {
      onDateChange?.(selectedDate)
      setIsOpen(false)
    }

    return (
      <div className={cn("relative", className)} ref={dropdownRef}>
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            mask="0000-00-00"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 rounded-md border bg-white p-3 shadow-lg">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={ko}
              showOutsideDays={true}
              className="rdp"
            />
          </div>
        )}
      </div>
    )
  }
)

DatePicker.displayName = "DatePicker"

// 날짜 범위 선택을 위한 DateRangePicker
interface DateRangePickerProps {
  from?: Date
  to?: Date
  onRangeChange?: (range: { from?: Date; to?: Date }) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const DateRangePicker = React.forwardRef<HTMLInputElement, DateRangePickerProps>(
  ({ from, to, onRangeChange, placeholder = "날짜 범위를 선택하세요", disabled, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
      onRangeChange?.(range || {})
    }

    const formatDateRange = () => {
      if (from && to) {
        return `${format(from, "yyyy-MM-dd")} ~ ${format(to, "yyyy-MM-dd")}`
      } else if (from) {
        return format(from, "yyyy-MM-dd")
      }
      return ""
    }

    return (
      <div className={cn("relative", className)} ref={dropdownRef}>
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            value={formatDateRange()}
            placeholder={placeholder}
            disabled={disabled}
            readOnly
            className="pr-10 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 rounded-md border bg-white p-3 shadow-lg">
            <DayPicker
              mode="range"
              selected={{ from, to }}
              onSelect={handleRangeSelect}
              locale={ko}
              showOutsideDays={true}
              className="rdp"
            />
          </div>
        )}
      </div>
    )
  }
)

DateRangePicker.displayName = "DateRangePicker"

export { DatePicker, DateRangePicker }