import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import Logger from '../utils/logger'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const AVATAR_STYLES = [
  { name: 'Pixel Art', value: 'pixel-art' },
  { name: 'Adventurer', value: 'adventurer' },
  { name: 'Avataaars', value: 'avataaars' },
  { name: 'Big Ears', value: 'big-ears' },
  { name: 'Bottts', value: 'bottts' },
  { name: 'Fun Emoji', value: 'fun-emoji' },
]

export default function ProfileSettings() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('pixel-art')
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user])

  useEffect(() => {
    // Generate new avatar URL when style changes
    if (user) {
      const seed = user.id // Using user ID as seed for consistency
      const newAvatarUrl = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`
      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }))
    }
  }, [selectedStyle, user])

  async function getProfile() {
    try {
      setLoading(true)
      Logger.info('Fetching user profile...')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setProfile(data)
        Logger.info('Profile loaded successfully')
      }
    } catch (error) {
      Logger.error('Error loading user profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(e) {
    e.preventDefault()
    
    try {
      setLoading(true)
      Logger.info('Updating user profile...')

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error
      
      Logger.info('Profile updated successfully')
      navigate('/dashboard')
    } catch (error) {
      Logger.error('Error updating user profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3f2103] via-[#654d35] to-[#8c7a68]">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#DBBD97] hover:text-[#b2a69a] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </button>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-3xl font-bold text-[#DBBD97] mb-8">Profile Settings</h2>
            
            <form onSubmit={updateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#DBBD97]">
                  Email
                </label>
                <input
                  type="text"
                  value={user?.email}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-[#DBBD97]/20 rounded-md shadow-sm text-[#DBBD97]/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#DBBD97]">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username || ''}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#DBBD97]/20 rounded-md shadow-sm focus:ring-[#DBBD97] focus:border-[#DBBD97] text-[#3f2103]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#DBBD97]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-[#DBBD97]/20 rounded-md shadow-sm focus:ring-[#DBBD97] focus:border-[#DBBD97] text-[#3f2103]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#DBBD97] mb-2">
                  Avatar Style
                </label>
                <div className="flex gap-4">
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#DBBD97]/20 rounded-md shadow-sm focus:ring-[#DBBD97] focus:border-[#DBBD97] text-[#3f2103]"
                  >
                    {AVATAR_STYLES.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#DBBD97] text-[#3f2103] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#b2a69a] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
