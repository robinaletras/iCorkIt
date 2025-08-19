import { prisma } from './prisma'

/**
 * Database upkeep function that runs automatically on database activity
 * Handles expired social pins, post unpinning, and other maintenance tasks
 */
export async function runDatabaseUpkeep() {
  try {
    console.log('🔄 Running database upkeep...')
    
    // Get current timestamp
    const now = new Date()
    
    // Find all expired active pins
    const expiredPins = await prisma.pin.findMany({
      where: {
        isActive: true,
        endDate: {
          lte: now
        }
      },
      include: {
        user: true,
        board: true
      }
    })
    
    if (expiredPins.length === 0) {
      console.log('✅ No expired pins found')
      return
    }
    
    console.log(`📌 Found ${expiredPins.length} expired pins to process`)
    
    // Process each expired pin
    for (const pin of expiredPins) {
      await processExpiredPin(pin)
    }
    
    console.log('✅ Database upkeep completed successfully')
  } catch (error) {
    console.error('❌ Database upkeep failed:', error)
  }
}

/**
 * Process a single expired pin
 */
async function processExpiredPin(pin: any) {
  try {
    console.log(`🔄 Processing expired pin ${pin.id} for post ${pin.postId}`)
    
    // Deactivate the pin
    await prisma.pin.update({
      where: { id: pin.id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })
    
    // If it's a social pin, return it to the user's social pins
    if (pin.pinType === 'SOCIAL') {
      await prisma.user.update({
        where: { id: pin.userId },
        data: {
          socialPins: {
            increment: pin.pinsUsed
          }
        }
      })
      
      console.log(`✅ Returned ${pin.pinsUsed} social pins to user ${pin.userId}`)
    }
    
    // Note: Regular pins are not returned (they are consumable)
    
    console.log(`✅ Successfully processed expired pin ${pin.id}`)
  } catch (error) {
    console.error(`❌ Failed to process expired pin ${pin.id}:`, error)
  }
}

/**
 * Check if upkeep is needed and run it if necessary
 * This function should be called before/after key database operations
 */
export async function checkAndRunUpkeep() {
  try {
    // Check if upkeep is needed by looking for expired pins
    const expiredPinsCount = await prisma.pin.count({
      where: {
        isActive: true,
        endDate: {
          lte: new Date()
        }
      }
    })
    
    // If there are expired pins, run upkeep
    if (expiredPinsCount > 0) {
      console.log(`🔍 Found ${expiredPinsCount} expired pins, running upkeep...`)
      await runDatabaseUpkeep()
    }
  } catch (error) {
    console.error('❌ Error checking upkeep status:', error)
  }
}

/**
 * Force run upkeep regardless of current state
 * Useful for manual maintenance or testing
 */
export async function forceRunUpkeep() {
  console.log('🔄 Force running database upkeep...')
  await runDatabaseUpkeep()
}
