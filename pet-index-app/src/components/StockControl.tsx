'use client'

import { useState, useEffect } from 'react'

interface StockControlProps {
  stock: number
  onChange: (newStock: number) => void
}

export default function StockControl({ stock, onChange }: StockControlProps) {
  const [inputValue, setInputValue] = useState(stock.toString())

  useEffect(() => {
    setInputValue(stock.toString())
  }, [stock])

  const handleMinus = () => {
    if (stock > 0) {
      onChange(stock - 1)
    }
  }

  const handlePlus = () => {
    onChange(stock + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const val = parseInt(inputValue, 10)
    if (!isNaN(val) && val >= 0) {
      if (val !== stock) {
        onChange(val)
      }
    } else {
      setInputValue(stock.toString()) // reset
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
        disabled={stock <= 0}
        className="w-8 h-8 rounded-l bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
      >
        −
      </button>
      <input
        type="text" // using text to avoid browser spin buttons
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
