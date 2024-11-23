import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import UserProfile from './UserProfile';
import { MessageSquare, Clock, Home, Settings, Users, BarChart, LogOut } from 'lucide-react';
import Logger from '../utils/logger';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [profile, setProfile] = useState({ username: '', full_name: '' });

  useEffect(() => {
    if (user) {
      fetchLatestConversations();
      fetchProfile();
    }
  }, [user]);

  async function fetchLatestConversations() {
    try {
      setLoading(true);
      Logger.info('Fetching latest conversations...');

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      setConversations(data || []);
      Logger.info('Conversations loaded successfully');
    } catch (error) {
      Logger.error('Error loading conversations:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      Logger.info('Fetching user profile...');
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        Logger.info('Profile loaded successfully');
      }
    } catch (error) {
      Logger.error('Error loading user profile:', error.message);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      hour12: false
    }) + ' UTC';
  }

  function truncateText(text, maxLength = 50) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3f2103] via-[#654d35] to-[#8c7a68]">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-[#DBBD97] text-2xl font-bold">AITCM</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={signOut}
              className="bg-[#DBBD97] text-[#3f2103] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#b2a69a] transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </motion.nav>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8"
        >
          <h1 className="text-3xl font-bold text-[#DBBD97]">
            Welcome back, {profile.username || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-[#DBBD97]/80 mt-2">
            Manage your profile and view your conversation history.
          </p>
        </motion.div>

        {/* Main Content Area with Sidebar */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-white/10 backdrop-blur-sm rounded-lg p-6 h-fit"
          >
            <nav className="space-y-4">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === 'dashboard' 
                    ? 'bg-[#DBBD97] text-[#3f2103]' 
                    : 'text-[#DBBD97] hover:bg-white/5'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/chat')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === 'chat' 
                    ? 'bg-[#DBBD97] text-[#3f2103]' 
                    : 'text-[#DBBD97] hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveSection('analytics')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === 'analytics' 
                    ? 'bg-[#DBBD97] text-[#3f2103]' 
                    : 'text-[#DBBD97] hover:bg-white/5'
                }`}
              >
                <BarChart className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveSection('team')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === 'team' 
                    ? 'bg-[#DBBD97] text-[#3f2103]' 
                    : 'text-[#DBBD97] hover:bg-white/5'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Team</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === 'settings' 
                    ? 'bg-[#DBBD97] text-[#3f2103]' 
                    : 'text-[#DBBD97] hover:bg-white/5'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#DBBD97] hover:bg-white/5 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </motion.div>

          {/* Recent Conversations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-[#DBBD97] mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Recent Conversations
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DBBD97]"></div>
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-[#DBBD97]/80 text-center py-8">
                No conversations yet. Start a new chat to begin!
              </p>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-[#DBBD97] font-medium">
                        {truncateText(conv.title)}
                      </h3>
                      <div className="flex items-center text-[#DBBD97]/60 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(conv.updated_at)}
                      </div>
                    </div>
                    {conv.messages?.length > 0 && (
                      <p className="text-[#DBBD97]/70 text-sm mt-2">
                        {truncateText(conv.messages[conv.messages.length - 1]?.content || '', 100)}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <button
                  onClick={() => setShowProfile(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <UserProfile />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
