'use client'

import { CorkBoard } from '@/components/boards/CorkBoard'

export default function StateBoardPage() {
  return (
    <CorkBoard
      boardId="state-overview"
      boardName="State Community Boards"
      boardType="STATE"
    />
  )
}
