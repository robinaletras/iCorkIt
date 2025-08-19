const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Top 8 cities that should have welcome posts
const top8Cities = [
  { name: 'New York', state: 'New York' },
  { name: 'Los Angeles', state: 'California' },
  { name: 'Chicago', state: 'Illinois' },
  { name: 'Houston', state: 'Texas' },
  { name: 'Phoenix', state: 'Arizona' },
  { name: 'Philadelphia', state: 'Pennsylvania' },
  { name: 'San Antonio', state: 'Texas' },
  { name: 'San Diego', state: 'California' }
]

async function addWelcomePosts() {
  try {
    console.log('📝 Starting welcome post creation...')
    
    // First, create a system user for welcome posts
    let systemUser = await prisma.user.findFirst({
      where: { email: 'system@icorkit.com' }
    })
    
    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          email: 'system@icorkit.com',
          displayName: 'iCorkIt System',
          password: 'system-user-password-hash',
          socialPins: 1000,
          pinPacks: 1000,
          isAdmin: true
        }
      })
      console.log('✅ Created system user')
    }
    
    // Add welcome posts to each top city
    for (const city of top8Cities) {
      const board = await prisma.board.findFirst({
        where: {
          type: 'CITY',
          city: city.name,
          state: city.state
        }
      })
      
      if (board) {
        // Check if welcome post already exists
        const existingPost = await prisma.post.findFirst({
          where: {
            boardId: board.id,
            title: { contains: 'Welcome' }
          }
        })
        
        if (!existingPost) {
          await prisma.post.create({
            data: {
              title: `Welcome to ${city.name}!`,
              content: `Welcome to the ${city.name} Community Board on iCorkIt! This is your local space to share announcements, find services, connect with neighbors, and stay informed about what's happening in ${city.name}. Start posting and pinning your content to make this board active and useful for everyone in the community.`,
              type: 'ANNOUNCEMENT',
              status: 'ACTIVE',
              boardId: board.id,
              authorId: systemUser.id,
              images: '[]',
              attachments: '[]',
              tags: '["welcome", "community", "local"]',
              location: city.name,
              category: 'Community'
            }
          })
          console.log(`✅ Added welcome post to ${city.name}, ${city.state}`)
        } else {
          console.log(`ℹ️  Welcome post already exists for ${city.name}, ${city.state}`)
        }
      } else {
        console.log(`❌ Board not found for ${city.name}, ${city.state}`)
      }
    }
    
    console.log('🎉 Welcome post creation completed!')
    
    // Show summary
    const totalPosts = await prisma.post.count()
    console.log(`📊 Total posts in database: ${totalPosts}`)
    
  } catch (error) {
    console.error('❌ Error creating welcome posts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addWelcomePosts()
