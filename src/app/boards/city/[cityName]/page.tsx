'use client'

import { CorkBoard } from '@/components/boards/CorkBoard'

interface CityBoardPageProps {
  params: {
    cityName: string
  }
}

export default function CityBoardPage({ params }: CityBoardPageProps) {
  // Convert URL slug back to readable city name
  const cityName = params.cityName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Temporary hardcoded board data to get pin functionality working
  // This bypasses the React hydration issue
  const board = {
    id: "cmeitigao003e13uxmh3yd6bs", // Augusta board ID from our earlier test
    name: `${cityName} Board`,
    type: "CITY",
    city: cityName,
    state: "GA"
  }

  console.log('Rendering CorkBoard with hardcoded board:', board)

  return (
    <CorkBoard
      boardId={board.id}
      boardName={board.name}
      boardType={board.type}
      cityName={board.city}
    />
  )
}
