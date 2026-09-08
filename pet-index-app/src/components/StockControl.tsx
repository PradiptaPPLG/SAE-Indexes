'use client'

import { useState, useEffect, useRef } from 'react'

interface StockControlProps {
  stock: number
  onChange: (newStock: number) => void
}

export default function StockControl({ stock, onChange }: StockControlProps) {
  const [localStock, setLocalStock] = useState(stock)
  const [inputValue, setInputValue] = useState(stock.toString())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update local state when parent prop changes, only if we are not actively debouncing
  useEffect(() => {
    if (!timeoutRef.current) {
      setLocalStock(stock)
      setInputValue(stock.toString())
    }
  }, [stock])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const triggerChange = (newStock: number) => {
    setLocalStock(newStock)
    setInputValue(newStock.toString())

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Delay the actual parent update by 3 seconds
    timeoutRef.current = setTimeout(() => {
      onChange(newStock)
      timeoutRef.current = null
    }, 3000)
  }

  const handleMinus = () => {
    if (localStock > 0) {
      triggerChange(localStock - 1)
    }
  }

  const handlePlus = () => {
    triggerChange(localStock + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const val = parseInt(inputValue, 10)
    if (!isNaN(val) && val >= 0) {
      if (val !== localStock) {
        triggerChange(val)
      }
    } else {
      setInputValue(localStock.toString()) // reset invalid input
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  return (
    <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
      <button 
        onClick={handleMinus}
        disabled={localStock <= 0}
        className="w-8 h-8 rounded-l bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
      >
        −
      </button>
      <input
        type="text" 
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        className="w-12 h-8 text-center border-y border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
      />
      <button 
        onClick={handlePlus}
        className="w-8 h-8 rounded-r bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors"
      >
        +
      </button>
    </div>
  )
}
