/**
 * AITCM Branded Homepage Component
 * The Future is HERE
 * 
 * Main landing page for AITCM application
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

const HomePage = ({ onShowAuth }) => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3f2103] via-[#654d35] to-[#8c7a68]">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end mb-8"
        >
          <button
            className="bg-[#DBBD97] text-[#3f2103] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#b2a69a] transition-all duration-300"
            onClick={onShowAuth}
          >
            Sign In
          </button>
        </motion.nav>

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
