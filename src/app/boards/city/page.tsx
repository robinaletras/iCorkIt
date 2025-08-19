'use client'

import { CorkBoard } from '@/components/boards/CorkBoard'

export default function CityBoardsPage() {
  return (
    <CorkBoard
      boardId="city"
      boardName="City Boards"
      boardType="CITY"
    />
  )
}
