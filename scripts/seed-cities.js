const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Top 8 major US cities (always shown)
const top8Cities = [
  { name: 'New York', state: 'New York', description: 'The Big Apple - New York City Community Board' },
  { name: 'Los Angeles', state: 'California', description: 'City of Angels - Los Angeles Community Board' },
  { name: 'Chicago', state: 'Illinois', description: 'Windy City - Chicago Community Board' },
  { name: 'Houston', state: 'Texas', description: 'Space City - Houston Community Board' },
  { name: 'Phoenix', state: 'Arizona', description: 'Valley of the Sun - Phoenix Community Board' },
  { name: 'Philadelphia', state: 'Pennsylvania', description: 'City of Brotherly Love - Philadelphia Community Board' },
  { name: 'San Antonio', state: 'Texas', description: 'Alamo City - San Antonio Community Board' },
  { name: 'San Diego', state: 'California', description: 'America\'s Finest City - San Diego Community Board' }
]

// Additional major cities (top 50+)
const majorCities = [
  { name: 'Dallas', state: 'Texas', description: 'Big D - Dallas Community Board' },
  { name: 'San Jose', state: 'California', description: 'Capital of Silicon Valley - San Jose Community Board' },
  { name: 'Austin', state: 'Texas', description: 'Live Music Capital - Austin Community Board' },
  { name: 'Jacksonville', state: 'Florida', description: 'River City - Jacksonville Community Board' },
  { name: 'Fort Worth', state: 'Texas', description: 'Cowtown - Fort Worth Community Board' },
  { name: 'Columbus', state: 'Ohio', description: 'Discovery City - Columbus Community Board' },
  { name: 'Charlotte', state: 'North Carolina', description: 'Queen City - Charlotte Community Board' },
  { name: 'San Francisco', state: 'California', description: 'Golden Gate City - San Francisco Community Board' },
  { name: 'Indianapolis', state: 'Indiana', description: 'Circle City - Indianapolis Community Board' },
  { name: 'Seattle', state: 'Washington', description: 'Emerald City - Seattle Community Board' },
  { name: 'Denver', state: 'Colorado', description: 'Mile High City - Denver Community Board' },
  { name: 'Washington', state: 'District of Columbia', description: 'Nation\'s Capital - Washington DC Community Board' },
  { name: 'Boston', state: 'Massachusetts', description: 'Beantown - Boston Community Board' },
  { name: 'El Paso', state: 'Texas', description: 'Sun City - El Paso Community Board' },
  { name: 'Nashville', state: 'Tennessee', description: 'Music City - Nashville Community Board' },
  { name: 'Detroit', state: 'Michigan', description: 'Motor City - Detroit Community Board' },
  { name: 'Oklahoma City', state: 'Oklahoma', description: 'OKC - Oklahoma City Community Board' },
  { name: 'Portland', state: 'Oregon', description: 'Rose City - Portland Community Board' },
  { name: 'Las Vegas', state: 'Nevada', description: 'Sin City - Las Vegas Community Board' },
  { name: 'Memphis', state: 'Tennessee', description: 'Blues City - Memphis Community Board' },
  { name: 'Louisville', state: 'Kentucky', description: 'Derby City - Louisville Community Board' },
  { name: 'Baltimore', state: 'Maryland', description: 'Charm City - Baltimore Community Board' },
  { name: 'Milwaukee', state: 'Wisconsin', description: 'Cream City - Milwaukee Community Board' },
  { name: 'Albuquerque', state: 'New Mexico', description: 'Duke City - Albuquerque Community Board' },
  { name: 'Tucson', state: 'Arizona', description: 'Old Pueblo - Tucson Community Board' },
  { name: 'Fresno', state: 'California', description: 'Fruit Basket of the World - Fresno Community Board' },
  { name: 'Sacramento', state: 'California', description: 'City of Trees - Sacramento Community Board' },
  { name: 'Mesa', state: 'Arizona', description: 'City of Mesa Community Board' },
  { name: 'Kansas City', state: 'Missouri', description: 'City of Fountains - Kansas City Community Board' },
  { name: 'Atlanta', state: 'Georgia', description: 'Hotlanta - Atlanta Community Board' },
  { name: 'Long Beach', state: 'California', description: 'International City - Long Beach Community Board' },
  { name: 'Colorado Springs', state: 'Colorado', description: 'Olympic City - Colorado Springs Community Board' },
  { name: 'Raleigh', state: 'North Carolina', description: 'City of Oaks - Raleigh Community Board' },
  { name: 'Miami', state: 'Florida', description: 'Magic City - Miami Community Board' },
  { name: 'Virginia Beach', state: 'Virginia', description: 'Resort City - Virginia Beach Community Board' },
  { name: 'Omaha', state: 'Nebraska', description: 'Gateway to the West - Omaha Community Board' },
  { name: 'Oakland', state: 'California', description: 'Oakland Community Board' },
  { name: 'Minneapolis', state: 'Minnesota', description: 'City of Lakes - Minneapolis Community Board' },
  { name: 'Tulsa', state: 'Oklahoma', description: 'Oil Capital - Tulsa Community Board' },
  { name: 'Arlington', state: 'Texas', description: 'Arlington Community Board' },
  { name: 'Tampa', state: 'Florida', description: 'Lightning Capital - Tampa Community Board' },
  { name: 'New Orleans', state: 'Louisiana', description: 'Big Easy - New Orleans Community Board' },
  { name: 'Wichita', state: 'Kansas', description: 'Air Capital - Wichita Community Board' },
  { name: 'Cleveland', state: 'Ohio', description: 'Forest City - Cleveland Community Board' },
  { name: 'Bakersfield', state: 'California', description: 'Bakersfield Community Board' },
  { name: 'Aurora', state: 'Colorado', description: 'Gateway to the Rockies - Aurora Community Board' },
  { name: 'Anaheim', state: 'California', description: 'Anaheim Community Board' },
  { name: 'Honolulu', state: 'Hawaii', description: 'Aloha City - Honolulu Community Board' },
  { name: 'Santa Ana', state: 'California', description: 'Santa Ana Community Board' },
  { name: 'Corpus Christi', state: 'Texas', description: 'Sparkling City - Corpus Christi Community Board' },
  { name: 'Riverside', state: 'California', description: 'City of Arts & Innovation - Riverside Community Board' },
  { name: 'Lexington', state: 'Kentucky', description: 'Horse Capital - Lexington Community Board' },
  { name: 'Stockton', state: 'California', description: 'Stockton Community Board' },
  { name: 'Henderson', state: 'Nevada', description: 'Henderson Community Board' },
  { name: 'Saint Paul', state: 'Minnesota', description: 'Saint Paul Community Board' },
  { name: 'St. Louis', state: 'Missouri', description: 'Gateway to the West - St. Louis Community Board' },
  { name: 'Cincinnati', state: 'Ohio', description: 'Queen City - Cincinnati Community Board' },
  { name: 'Pittsburgh', state: 'Pennsylvania', description: 'Steel City - Pittsburgh Community Board' },
  { name: 'Anchorage', state: 'Alaska', description: 'Anchorage Community Board' },
  { name: 'Reno', state: 'Nevada', description: 'Biggest Little City - Reno Community Board' },
  { name: 'Durham', state: 'North Carolina', description: 'Bull City - Durham Community Board' },
  { name: 'Greensboro', state: 'North Carolina', description: 'Gate City - Greensboro Community Board' },
  { name: 'Chula Vista', state: 'California', description: 'Chula Vista Community Board' },
  { name: 'Irvine', state: 'California', description: 'Irvine Community Board' },
  { name: 'Orlando', state: 'Florida', description: 'City Beautiful - Orlando Community Board' },
  { name: 'Laredo', state: 'Texas', description: 'Laredo Community Board' },
  { name: 'Lubbock', state: 'Texas', description: 'Hub City - Lubbock Community Board' },
  { name: 'Boise', state: 'Idaho', description: 'City of Trees - Boise Community Board' },
  { name: 'Spokane', state: 'Washington', description: 'Lilac City - Spokane Community Board' },
  { name: 'Fremont', state: 'California', description: 'Fremont Community Board' },
  { name: 'Richmond', state: 'Virginia', description: 'River City - Richmond Community Board' },
  { name: 'Baton Rouge', state: 'Louisiana', description: 'Red Stick - Baton Rouge Community Board' },
  { name: 'Des Moines', state: 'Iowa', description: 'Des Moines Community Board' },
  { name: 'Tacoma', state: 'Washington', description: 'City of Destiny - Tacoma Community Board' },
  { name: 'San Bernardino', state: 'California', description: 'San Bernardino Community Board' },
  { name: 'Modesto', state: 'California', description: 'Modesto Community Board' },
  { name: 'Fontana', state: 'California', description: 'Fontana Community Board' },
  { name: 'Oxnard', state: 'California', description: 'Oxnard Community Board' },
  { name: 'Moreno Valley', state: 'California', description: 'Moreno Valley Community Board' },
  { name: 'Glendale', state: 'Arizona', description: 'Glendale Community Board' },
  { name: 'Huntington Beach', state: 'California', description: 'Surf City - Huntington Beach Community Board' },
  { name: 'Columbus', state: 'Georgia', description: 'Columbus Community Board' },
  { name: 'Grand Rapids', state: 'Michigan', description: 'Grand Rapids Community Board' },
  { name: 'Salt Lake City', state: 'Utah', description: 'Crossroads of the West - Salt Lake City Community Board' },
  { name: 'Tallahassee', state: 'Florida', description: 'Tallahassee Community Board' },
  { name: 'Birmingham', state: 'Alabama', description: 'Magic City - Birmingham Community Board' },
  { name: 'Jackson', state: 'Mississippi', description: 'Jackson Community Board' },
  { name: 'Little Rock', state: 'Arkansas', description: 'Little Rock Community Board' },
  { name: 'Montgomery', state: 'Alabama', description: 'Montgomery Community Board' },
  { name: 'Des Moines', state: 'Iowa', description: 'Des Moines Community Board' },
  { name: 'Pierre', state: 'South Dakota', description: 'Pierre Community Board' },
  { name: 'Bismarck', state: 'North Dakota', description: 'Bismarck Community Board' },
  { name: 'Helena', state: 'Montana', description: 'Helena Community Board' },
  { name: 'Cheyenne', state: 'Wyoming', description: 'Cheyenne Community Board' },
  { name: 'Carson City', state: 'Nevada', description: 'Carson City Community Board' },
  { name: 'Salem', state: 'Oregon', description: 'Salem Community Board' },
  { name: 'Sacramento', state: 'California', description: 'City of Trees - Sacramento Community Board' },
  { name: 'Olympia', state: 'Washington', description: 'Olympia Community Board' },
  { name: 'Boise', state: 'Idaho', description: 'City of Trees - Boise Community Board' },
  { name: 'Cheyenne', state: 'Wyoming', description: 'Cheyenne Community Board' },
  { name: 'Denver', state: 'Colorado', description: 'Mile High City - Denver Community Board' },
  { name: 'Santa Fe', state: 'New Mexico', description: 'City Different - Santa Fe Community Board' },
  { name: 'Phoenix', state: 'Arizona', description: 'Valley of the Sun - Phoenix Community Board' },
  { name: 'Austin', state: 'Texas', description: 'Live Music Capital - Austin Community Board' },
  { name: 'Oklahoma City', state: 'Oklahoma', description: 'OKC - Oklahoma City Community Board' },
  { name: 'Topeka', state: 'Kansas', description: 'Topeka Community Board' },
  { name: 'Jefferson City', state: 'Missouri', description: 'Jefferson City Community Board' },
  { name: 'Springfield', state: 'Illinois', description: 'Springfield Community Board' },
  { name: 'Madison', state: 'Wisconsin', description: 'Madison Community Board' },
  { name: 'Lansing', state: 'Michigan', description: 'Lansing Community Board' },
  { name: 'Indianapolis', state: 'Indiana', description: 'Circle City - Indianapolis Community Board' },
  { name: 'Columbus', state: 'Ohio', description: 'Discovery City - Columbus Community Board' },
  { name: 'Frankfort', state: 'Kentucky', description: 'Frankfort Community Board' },
  { name: 'Nashville', state: 'Tennessee', description: 'Music City - Nashville Community Board' },
  { name: 'Jackson', state: 'Mississippi', description: 'Jackson Community Board' },
  { name: 'Baton Rouge', state: 'Louisiana', description: 'Red Stick - Baton Rouge Community Board' },
  { name: 'Little Rock', state: 'Arkansas', description: 'Little Rock Community Board' },
  { name: 'Jackson', state: 'Mississippi', description: 'Jackson Community Board' },
  { name: 'Montgomery', state: 'Alabama', description: 'Montgomery Community Board' },
  { name: 'Tallahassee', state: 'Florida', description: 'Tallahassee Community Board' },
  { name: 'Atlanta', state: 'Georgia', description: 'Hotlanta - Atlanta Community Board' },
  { name: 'Columbia', state: 'South Carolina', description: 'Columbia Community Board' },
  { name: 'Raleigh', state: 'North Carolina', description: 'City of Oaks - Raleigh Community Board' },
  { name: 'Richmond', state: 'Virginia', description: 'River City - Richmond Community Board' },
  { name: 'Charleston', state: 'West Virginia', description: 'Charleston Community Board' },
  { name: 'Annapolis', state: 'Maryland', description: 'Annapolis Community Board' },
  { name: 'Dover', state: 'Delaware', description: 'Dover Community Board' },
  { name: 'Trenton', state: 'New Jersey', description: 'Trenton Community Board' },
  { name: 'Harrisburg', state: 'Pennsylvania', description: 'Harrisburg Community Board' },
  { name: 'Albany', state: 'New York', description: 'Albany Community Board' },
  { name: 'Hartford', state: 'Connecticut', description: 'Hartford Community Board' },
  { name: 'Providence', state: 'Rhode Island', description: 'Providence Community Board' },
  { name: 'Boston', state: 'Massachusetts', description: 'Beantown - Boston Community Board' },
  { name: 'Concord', state: 'New Hampshire', description: 'Concord Community Board' },
  { name: 'Montpelier', state: 'Vermont', description: 'Montpelier Community Board' },
  { name: 'Augusta', state: 'Maine', description: 'Augusta Community Board' },
  { name: 'Honolulu', state: 'Hawaii', description: 'Aloha City - Honolulu Community Board' },
  { name: 'Anchorage', state: 'Alaska', description: 'Anchorage Community Board' }
]

async function seedCities() {
  try {
    console.log('🌆 Starting city seeding...')
    
    // First, create the top 8 cities with featured status
    for (let i = 0; i < top8Cities.length; i++) {
      const city = top8Cities[i]
      const existingBoard = await prisma.board.findFirst({
        where: {
          type: 'CITY',
          city: city.name,
          state: city.state
        }
      })
      
      if (!existingBoard) {
        await prisma.board.create({
          data: {
            name: `${city.name} Community Board`,
            type: 'CITY',
            description: city.description,
            city: city.name,
            state: city.state,
            country: 'USA',
            isPrivate: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        console.log(`✅ Created top city: ${city.name}, ${city.state}`)
      } else {
        console.log(`ℹ️  Top city already exists: ${city.name}, ${city.state}`)
      }
    }
    
    // Then create additional major cities
    for (const city of majorCities) {
      const existingBoard = await prisma.board.findFirst({
        where: {
          type: 'CITY',
          city: city.name,
          state: city.state
        }
      })
      
      if (!existingBoard) {
        await prisma.board.create({
          data: {
            name: `${city.name} Community Board`,
            type: 'CITY',
            description: city.description,
            city: city.name,
            state: city.state,
            country: 'USA',
            isPrivate: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        console.log(`✅ Created city: ${city.name}, ${city.state}`)
      } else {
        console.log(`ℹ️  City already exists: ${city.name}, ${city.state}`)
      }
    }
    
    console.log('🎉 City seeding completed!')
    
    // Show summary
    const totalCities = await prisma.board.count({
      where: { type: 'CITY' }
    })
    console.log(`📊 Total cities in database: ${totalCities}`)
    
  } catch (error) {
    console.error('❌ Error seeding cities:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCities()
