const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// All 50 states plus DC
const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia'
]

async function createNationalAndStateBoards() {
  try {
    console.log('🏛️ Starting national and state board creation...')
    
    // Create National board
    const existingNational = await prisma.board.findFirst({
      where: { type: 'NATIONAL' }
    })
    
    if (!existingNational) {
      const nationalBoard = await prisma.board.create({
        data: {
          name: 'National Community Board',
          type: 'NATIONAL',
          city: 'National',
          state: 'National',
          country: 'USA',
          description: 'The main national community board for all of America. Share announcements, discuss national topics, and connect with people across the country.',
          isApproved: true
        }
      })
      console.log('✅ Created National board')
    } else {
      console.log('ℹ️  National board already exists')
    }
    
    // Create State boards
    for (const state of states) {
      const existingState = await prisma.board.findFirst({
        where: { 
          type: 'STATE',
          state: state
        }
      })
      
      if (!existingState) {
        const stateBoard = await prisma.board.create({
          data: {
            name: `${state} State Board`,
            type: 'STATE',
            city: state,
            state: state,
            country: 'USA',
            description: `The ${state} state community board. Connect with people across ${state}, share local news, and discuss state-wide topics.`,
            isApproved: true
          }
        })
        console.log(`✅ Created ${state} state board`)
      } else {
        console.log(`ℹ️  ${state} state board already exists`)
      }
    }
    
    console.log('🎉 National and state board creation completed!')
    
    // Show summary
    const totalBoards = await prisma.board.count()
    console.log(`📊 Total boards in database: ${totalBoards}`)
    
  } catch (error) {
    console.error('❌ Error creating boards:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createNationalAndStateBoards()
