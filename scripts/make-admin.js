const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function makeFirstUserAdmin() {
  try {
    // Find the first user
    const firstUser = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' }
    })

    if (!firstUser) {
      console.log('No users found in database')
      return
    }

    // Make them an admin
    await prisma.user.update({
      where: { id: firstUser.id },
      data: { isAdmin: true }
    })

    console.log(`User ${firstUser.email} is now an admin`)
  } catch (error) {
    console.error('Error making user admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makeFirstUserAdmin()
