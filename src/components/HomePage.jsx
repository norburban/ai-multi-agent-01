/**
 * AITCM Branded Homepage Component
 * The Future is HERE
 * 
 * Main landing page for AITCM application
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const HomePage = ({ onShowAuth }) => {
  const { user, signOut } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

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
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#DBBD97] text-[#3f2103] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#b2a69a] transition-all duration-300"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-[#DBBD97] text-[#3f2103] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#b2a69a] transition-all duration-300"
                >
                  Chat
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="bg-[#DBBD97] text-[#3f2103] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#b2a69a] transition-all duration-300"
                  >
                    {user.email}
                  </button>
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <button
                        onClick={() => setShowProfile(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                className="bg-[#DBBD97] text-[#3f2103] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#b2a69a] transition-all duration-300"
                onClick={onShowAuth}
              >
                Sign In
              </button>
            )}
          </div>
        </motion.nav>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-[#d9d3cd] mb-6">
            AITCM
          </h1>
          <p className="text-xl text-[#d9d3cd] mb-12 max-w-2xl mx-auto">
            The Future is HERE
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: 'Communications Specialist',
              description: 'Expert AI agent for managing IT Crisis Management communications, ensuring clear and timely updates during major incidents',
              icon: '📢',
            },
            {
              title: 'SAN Report Specialist',
              description: 'Specialized in creating Situation Action Needs reports, tracking incident progress and providing structured updates',
              icon: '📋',
            },
            {
              title: 'AIR Specialist',
              description: 'Advanced Incident Response specialist focused on analyzing and documenting major IT incidents',
              icon: '🔍',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-[#63513D]/10 backdrop-blur-lg p-8 rounded-xl border border-[#d9d3cd]/20 hover:bg-[#63513D]/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#d9d3cd] mb-2">{feature.title}</h3>
              <p className="text-[#d9d3cd]">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <button
            className="bg-gradient-to-r from-[#DBBD97] to-[#b2a69a] text-[#3f2103] px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300"
            onClick={onShowAuth}
          >
            Get Started
          </button>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 py-6 border-t border-[#d9d3cd]/20 text-center"
        >
          <p className="text-sm text-[#d9d3cd]/70">
            2024 AITCM. All rights reserved by Norb Urban @ Synthellect.ai
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default HomePage;
