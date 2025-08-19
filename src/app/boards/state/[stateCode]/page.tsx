'use client'

import { CorkBoard } from '@/components/boards/CorkBoard'

interface StateBoardPageProps {
  params: {
    stateCode: string
  }
}

export default function StateBoardPage({ params }: StateBoardPageProps) {
  // Convert state code to full name
  const getStateName = (code: string): string => {
    const stateNames: { [key: string]: string } = {
      'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas',
      'ca': 'California', 'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware',
      'fl': 'Florida', 'ga': 'Georgia', 'hi': 'Hawaii', 'id': 'Idaho',
      'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa', 'ks': 'Kansas',
      'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
      'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi',
      'mo': 'Missouri', 'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada',
      'nh': 'New Hampshire', 'nj': 'New Jersey', 'nm': 'New Mexico', 'ny': 'New York',
      'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio', 'ok': 'Oklahoma',
      'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
      'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah',
      'vt': 'Vermont', 'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia',
      'wi': 'Wisconsin', 'wy': 'Wyoming'
    }
    return stateNames[code.toLowerCase()] || code.toUpperCase()
  }

  const stateName = getStateName(params.stateCode)

  return (
    <CorkBoard
      boardId={`state-${params.stateCode}`}
      boardName={`${stateName} Community Board`}
      boardType="STATE"
      stateCode={params.stateCode.toUpperCase()}
    />
  )
}
