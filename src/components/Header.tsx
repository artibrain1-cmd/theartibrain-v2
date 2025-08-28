"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-700/50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-white">TheArtiBrain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
            >
              Categories
            </Link>
            <Link
              href="/authors"
              className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
            >
              Authors
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/auth/signin"
              className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-700/50 pt-4"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/authors"
                className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Authors
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-indigo-700 transition-all duration-200 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}

