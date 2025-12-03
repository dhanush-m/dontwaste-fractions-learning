'use client'

import { useState, useRef, useEffect } from 'react'

export default function FractionCanvas({ numerator, denominator, onFractionChange }) {
  const [dimensions, setDimensions] = useState({ width: 400, height: 200 })
  const [KonvaComponents, setKonvaComponents] = useState(null)
  const containerRef = useRef(null)

  // Dynamically load react-konva only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-konva').then((konva) => {
        setKonvaComponents({
          Stage: konva.Stage,
          Layer: konva.Layer,
          Rect: konva.Rect,
        })
      }).catch((err) => {
        console.error('Failed to load react-konva:', err)
      })
    }
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(400, containerRef.current.offsetWidth - 32)
        setDimensions({ width, height: width * 0.5 })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const partWidth = dimensions.width / denominator
  const partHeight = dimensions.height

  // Render canvas only when Konva components are loaded
  const renderCanvas = () => {
    if (!KonvaComponents) {
      return (
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading canvas...</p>
        </div>
      )
    }

    const { Stage, Layer, Rect } = KonvaComponents

    return (
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {Array.from({ length: denominator }).map((_, i) => (
            <Rect
              key={i}
              x={i * partWidth}
              y={0}
              width={partWidth}
              height={partHeight}
              fill={i < numerator ? '#3B82F6' : '#E5E7EB'}
              stroke="#1F2937"
              strokeWidth={2}
              cornerRadius={4}
            />
          ))}
        </Layer>
      </Stage>
    )
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div ref={containerRef} className="w-full max-w-md">
        {renderCanvas()}
      </div>

      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of parts (Denominator): {denominator}
          </label>
          <input
            type="range"
            min="2"
            max="8"
            value={denominator}
            onChange={(e) => {
              const newDenom = parseInt(e.target.value)
              const newNum = Math.min(numerator, newDenom)
              onFractionChange(newNum, newDenom)
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shaded parts (Numerator): {numerator}
          </label>
          <input
            type="range"
            min="0"
            max={denominator}
            value={numerator}
            onChange={(e) => {
              onFractionChange(parseInt(e.target.value), denominator)
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">
            {numerator}/{denominator}
          </p>
        </div>
      </div>
    </div>
  )
}
