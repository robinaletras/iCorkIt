'use client'

import React, { useState } from 'react'
import { MapPin, Search, Building2, Users, Calendar, Star } from 'lucide-react'
import Link from 'next/link'

interface CityInfo {
  name: string
  slug: string
  population: string
  postCount: number
  featured: boolean
  region: string
  coordinates: { lat: number; lng: number }
}

export default function CaliforniaStatePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const cities: CityInfo[] = [
    // Major Cities
    { name: 'Los Angeles', slug: 'los-angeles', population: '4M', postCount: 156, featured: true, region: 'Southern California', coordinates: { lat: 34.0522, lng: -118.2437 } },
    { name: 'San Francisco', slug: 'san-francisco', population: '873K', postCount: 234, featured: true, region: 'Bay Area', coordinates: { lat: 37.7749, lng: -122.4194 } },
    { name: 'San Diego', slug: 'san-diego', population: '1.4M', postCount: 189, featured: true, region: 'Southern California', coordinates: { lat: 32.7157, lng: -117.1611 } },
    { name: 'Sacramento', slug: 'sacramento', population: '513K', postCount: 98, featured: true, region: 'Central Valley', coordinates: { lat: 38.5816, lng: -121.4944 } },
    
    // Bay Area
    { name: 'Oakland', slug: 'oakland', population: '440K', postCount: 145, featured: false, region: 'Bay Area', coordinates: { lat: 37.8044, lng: -122.2711 } },
    { name: 'San Jose', slug: 'san-jose', population: '1M', postCount: 167, featured: false, region: 'Bay Area', coordinates: { lat: 37.3382, lng: -121.8863 } },
    { name: 'Berkeley', slug: 'berkeley', population: '124K', postCount: 89, featured: false, region: 'Bay Area', coordinates: { lat: 37.8715, lng: -122.2730 } },
    { name: 'Palo Alto', slug: 'palo-alto', population: '68K', postCount: 67, featured: false, region: 'Bay Area', coordinates: { lat: 37.4419, lng: -122.1430 } },
    
    // Southern California
    { name: 'Long Beach', slug: 'long-beach', population: '466K', postCount: 123, featured: false, region: 'Southern California', coordinates: { lat: 33.7701, lng: -118.1937 } },
    { name: 'Anaheim', slug: 'anaheim', population: '346K', postCount: 78, featured: false, region: 'Southern California', coordinates: { lat: 33.8366, lng: -117.9143 } },
    { name: 'Santa Ana', slug: 'santa-ana', population: '332K', postCount: 56, featured: false, region: 'Southern California', coordinates: { lat: 33.7455, lng: -117.8677 } },
    { name: 'Irvine', slug: 'irvine', population: '307K', postCount: 89, featured: false, region: 'Southern California', coordinates: { lat: 33.6846, lng: -117.8265 } },
    
    // Central Valley
    { name: 'Fresno', slug: 'fresno', population: '542K', postCount: 67, featured: false, region: 'Central Valley', coordinates: { lat: 36.7378, lng: -119.7871 } },
    { name: 'Bakersfield', slug: 'bakersfield', population: '403K', postCount: 45, featured: false, region: 'Central Valley', coordinates: { lat: 35.3733, lng: -119.0187 } },
    { name: 'Stockton', slug: 'stockton', population: '320K', postCount: 34, featured: false, region: 'Central Valley', coordinates: { lat: 37.9577, lng: -121.2908 } },
    
    // Other Regions
    { name: 'Santa Barbara', slug: 'santa-barbara', population: '91K', postCount: 78, featured: false, region: 'Central Coast', coordinates: { lat: 34.4208, lng: -119.6982 } },
    { name: 'Monterey', slug: 'monterey', population: '28K', postCount: 45, featured: false, region: 'Central Coast', coordinates: { lat: 36.6002, lng: -121.8947 } },
    { name: 'Santa Cruz', slug: 'santa-cruz', population: '64K', postCount: 67, featured: false, region: 'Central Coast', coordinates: { lat: 36.9741, lng: -122.0308 } }
  ]

  const regions = ['all', 'Bay Area', 'Southern California', 'Central Valley', 'Central Coast']

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const featuredCities = cities.filter(city => city.featured)
  const totalPosts = cities.reduce((sum, city) => sum + city.postCount, 0)
  const totalPopulation = cities.reduce((sum, city) => sum + parseInt(city.population.replace(/[^\d]/g, '')), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">CA</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              California Community Boards
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with communities across the Golden State. From the Bay Area to Southern California, 
              discover local events, businesses, and connections in your area.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">City Boards</p>
                  <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Population</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPopulation.toLocaleString()}K+</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Regions</p>
                  <p className="text-2xl font-bold text-gray-900">{regions.length - 1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search cities in California..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Region Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region === 'all' ? 'All Regions' : region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cities */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Featured Cities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCities.map((city) => (
              <Link key={city.slug} href={`/boards/city/${city.slug}`}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 hover:scale-105 group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{city.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{city.population} people</p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <span>{city.postCount} posts</span>
                      <span>•</span>
                      <span>{city.region}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* All Cities Grid */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            All Cities ({filteredCities.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCities.map((city) => (
              <Link key={city.slug} href={`/boards/city/${city.slug}`}>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {city.name}
                    </h3>
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{city.population} people</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{city.postCount} posts</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{city.region}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See Your City?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Create a new city board for your California community and start connecting with neighbors today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/create-board"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Create City Board
            </a>
            <a
              href="/boards/state"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors"
            >
              Back to States
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
