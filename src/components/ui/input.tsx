import * as React from "react"
import { IMaskInput } from "react-imask"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string | any
  unmask?: boolean | "typed"
  onAccept?: (value: string, mask: any) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, unmask, onAccept, ...props }, ref) => {
    const baseClassName = cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )

    if (mask) {
      return (
        <IMaskInput
          mask={mask}
          unmask={unmask}
          onAccept={onAccept}
          className={baseClassName}
          inputRef={ref}
          {...(props as any)}
        />
      )
    }

    return (
      <input
        type={type}
        className={baseClassName}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// 특수 용도의 Input 컴포넌트들
const PhoneInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'mask'>>(
  ({ ...props }, ref) => {
    return (
      <Input
        ref={ref}
        mask="000-0000-0000"
        placeholder="010-0000-0000"
        {...props}
      />
    )
  }
)
PhoneInput.displayName = "PhoneInput"

const CurrencyInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'mask'>>(
  ({ ...props }, ref) => {
    return (
      <Input
        ref={ref}
        mask={Number}
        unmask={true}
        placeholder="0"
        {...props}
      />
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

const BusinessNumberInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'mask'>>(
  ({ ...props }, ref) => {
    return (
      <Input
        ref={ref}
        mask="000-00-00000"
        placeholder="000-00-00000"
        {...props}
      />
    )
  }
)
BusinessNumberInput.displayName = "BusinessNumberInput"

export { Input, PhoneInput, CurrencyInput, BusinessNumberInput }