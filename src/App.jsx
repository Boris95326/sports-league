import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, Trophy, Calendar, MapPin, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [leagues, setLeagues] = useState([])
  const [filteredLeagues, setFilteredLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [badgeImage, setBadgeImage] = useState(null)
  const [badgeLoading, setBadgeLoading] = useState(false)

  // Cache for API responses
  const [cache, setCache] = useState({
    leagues: null,
    badges: {}
  })

  // Fetch leagues from API
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        // Check cache first
        if (cache.leagues) {
          setLeagues(cache.leagues)
          setFilteredLeagues(cache.leagues)
          setLoading(false)
          return
        }

        const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php')
        if (!response.ok) {
          throw new Error('Failed to fetch leagues')
        }
        const data = await response.json()
        
        if (data.leagues) {
          setLeagues(data.leagues)
          setFilteredLeagues(data.leagues)
          setCache(prev => ({ ...prev, leagues: data.leagues }))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeagues()
  }, [cache.leagues])

  // Filter leagues based on search term and sport
  useEffect(() => {
    let filtered = leagues

    if (searchTerm) {
      filtered = filtered.filter(league =>
        league.strLeague.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.strSport.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSport !== 'all') {
      filtered = filtered.filter(league =>
        league.strSport.toLowerCase() === selectedSport.toLowerCase()
      )
    }

    setFilteredLeagues(filtered)
  }, [leagues, searchTerm, selectedSport])

  // Get unique sports for dropdown
  const uniqueSports = [...new Set(leagues.map(league => league.strSport))].sort()

  // Fetch badge image for selected league
  const fetchBadgeImage = async (leagueId) => {
    try {
      setBadgeLoading(true)
      
      // Check cache first
      if (cache.badges[leagueId]) {
        setBadgeImage(cache.badges[leagueId])
        setBadgeLoading(false)
        return
      }

      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=${leagueId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch badge')
      }
      const data = await response.json()
      
      let badgeUrl = null
      if (data.seasons && data.seasons.length > 0) {
        // Try to find a badge from the most recent season
        const seasonWithBadge = data.seasons.find(season => season.strBadge)
        badgeUrl = seasonWithBadge ? seasonWithBadge.strBadge : null
      }
      
      setBadgeImage(badgeUrl)
      setCache(prev => ({
        ...prev,
        badges: { ...prev.badges, [leagueId]: badgeUrl }
      }))
    } catch (err) {
      console.error('Error fetching badge:', err)
      setBadgeImage(null)
    } finally {
      setBadgeLoading(false)
    }
  }

  const handleLeagueClick = (league) => {
    setSelectedLeague(league)
    setBadgeImage(null)
    if (league.idLeague) {
      fetchBadgeImage(league.idLeague)
    }
  }

  const clearSelection = () => {
    setSelectedLeague(null)
    setBadgeImage(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading sports leagues...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Trophy className="h-10 w-10 text-yellow-500" />
            Sports Leagues
          </h1>
          <p className="text-lg text-gray-600">Discover sports leagues from around the world</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search leagues by name or sport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {uniqueSports.map(sport => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchTerm || selectedSport !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSelectedSport('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredLeagues.length} of {leagues.length} leagues
          </p>
        </div>

        {/* Selected League Badge Modal */}
        {selectedLeague && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedLeague.strLeague}</span>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    ×
                  </Button>
                </CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mr-2">
                    {selectedLeague.strSport}
                  </Badge>
                  {selectedLeague.strLeagueAlternate && (
                    <span className="text-sm text-gray-500">
                      Also known as: {selectedLeague.strLeagueAlternate}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {badgeLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2">Loading badge...</span>
                    </div>
                  ) : badgeImage ? (
                    <img 
                      src={badgeImage} 
                      alt={`${selectedLeague.strLeague} badge`}
                      className="mx-auto max-w-32 max-h-32 object-contain"
                      onError={() => setBadgeImage(null)}
                    />
                  ) : (
                    <div className="py-8 text-gray-500">
                      <Trophy className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                      <p>No badge available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLeagues.map((league) => (
            <Card 
              key={league.idLeague} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 bg-white/80 backdrop-blur-sm"
              onClick={() => handleLeagueClick(league)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {league.strLeague}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {league.strSport}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {league.strLeagueAlternate && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Also known as:</span> {league.strLeagueAlternate}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    ID: {league.idLeague}
                  </span>
                  <span className="text-blue-600 font-medium">Click for badge</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredLeagues.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No leagues found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Data provided by TheSportsDB API</p>
        </div>
      </div>
    </div>
  )
}

export default App
