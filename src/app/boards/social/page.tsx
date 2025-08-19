'use client'

import { CorkBoard } from '@/components/boards/CorkBoard'

export default function SocialBoardsPage() {
  return (
    <CorkBoard
      boardId="social"
      boardName="Social Boards"
      boardType="SOCIAL"
    />
  )
}
