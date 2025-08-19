const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createSocialBoards() {
  try {
    console.log('Creating social boards for existing users...')
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, displayName: true, email: true }
    })
    
    console.log(`Found ${users.length} users`)
    
    for (const user of users) {
      // Check if user already has a social board
      const existingBoard = await prisma.board.findFirst({
        where: {
          socialOwnerId: user.id,
          type: 'SOCIAL'
        }
      })
      
      if (!existingBoard) {
        // Create social board for this user
        const socialBoard = await prisma.board.create({
          data: {
            name: `${user.displayName}'s Social Board`,
            type: 'SOCIAL',
            description: `Personal social board for ${user.displayName}`,
            socialOwnerId: user.id,
            isApproved: true
          }
        })
        
        console.log(`Created social board ${socialBoard.id} for user ${user.displayName}`)
        
        // Update existing social posts to use this boardId
        const updatedPosts = await prisma.post.updateMany({
          where: {
            authorId: user.id,
            boardId: null,
            type: 'SOCIAL'
          },
          data: {
            boardId: socialBoard.id
          }
        })
        
        console.log(`Updated ${updatedPosts.count} posts for user ${user.displayName}`)
      } else {
        console.log(`User ${user.displayName} already has social board ${existingBoard.id}`)
      }
    }
    
    console.log('Social board creation complete!')
    
  } catch (error) {
    console.error('Error creating social boards:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSocialBoards()
