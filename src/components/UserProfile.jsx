import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import Logger from '../utils/logger'

export default function UserProfile() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
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
    } catch (error) {
      Logger.error('Error updating user profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
        
        <form onSubmit={updateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={user?.email}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
