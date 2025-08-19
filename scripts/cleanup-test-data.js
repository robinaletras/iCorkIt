const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupAllTestData() {
  try {
    console.log('🧹 CLEANING UP ALL TEST DATA...')
    console.log('=' .repeat(50))
    
    // Delete all test purchases
    const deletedPurchases = await prisma.pinPurchase.deleteMany({
      where: {
        OR: [
          { user: { email: { contains: 'test' } } },
          { user: { email: { contains: 'comprehensive' } } },
          { user: { email: { contains: 'stripe' } } },
          { user: { email: { contains: 'pin-purchase' } } }
        ]
      }
    })
    console.log(`🗑️  Deleted ${deletedPurchases.count} test purchases`)
    
    // Delete all test pins
    const deletedPins = await prisma.pin.deleteMany({
      where: {
        OR: [
          { user: { email: { contains: 'test' } } },
          { user: { email: { contains: 'comprehensive' } } },
          { user: { email: { contains: 'stripe' } } },
          { user: { email: { contains: 'pin-purchase' } } }
        ]
      }
    })
    console.log(`🗑️  Deleted ${deletedPins.count} test pins`)
    
    // Delete all test posts
    const deletedPosts = await prisma.post.deleteMany({
      where: {
        OR: [
          { author: { email: { contains: 'test' } } },
          { author: { email: { contains: 'comprehensive' } } },
          { author: { email: { contains: 'stripe' } } },
          { author: { email: { contains: 'pin-purchase' } } }
        ]
      }
    })
    console.log(`🗑️  Deleted ${deletedPosts.count} test posts`)
    
    // Delete all test boards
    const deletedBoards = await prisma.board.deleteMany({
      where: {
        OR: [
          { socialOwner: { email: { contains: 'test' } } },
          { socialOwner: { email: { contains: 'comprehensive' } } },
          { socialOwner: { email: { contains: 'stripe' } } },
          { socialOwner: { email: { contains: 'pin-purchase' } } }
        ]
      }
    })
    console.log(`🗑️  Deleted ${deletedBoards.count} test boards`)
    
    // Delete all test users
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: 'test' } },
          { email: { contains: 'comprehensive' } },
          { email: { contains: 'stripe' } },
          { email: { contains: 'pin-purchase' } }
        ]
      }
    })
    console.log(`🗑️  Deleted ${deletedUsers.count} test users`)
    
    console.log('\n✅ ALL TEST DATA CLEANED UP!')
    console.log('🎯 City boards should now be clean and empty')
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupAllTestData()
