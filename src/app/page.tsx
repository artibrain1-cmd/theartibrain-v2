"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { ArrowRight, TrendingUp, BookOpen, Users, Mail } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  publishedAt: string
  author: {
    name: string
    avatarUrl?: string
  }
  categories: Array<{
    category: {
      name: string
      slug: string
    }
  }>
}

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const postsResponse = await fetch("/api/posts?status=PUBLISHED")
        const postsData = await postsResponse.json()
        
        if (postsData.length > 0) {
          setFeaturedPost(postsData[0])
          setPosts(postsData.slice(1, 7)) // Next 6 posts
        }

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.slice(0, 6)) // Top 6 categories
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {featuredPost ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40 z-10" />
              {featuredPost.featuredImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${featuredPost.featuredImage})` }}
                />
              )}
              
              <div className="relative z-20 h-full flex items-center">
                <div className="container mx-auto px-8">
                  <div className="max-w-2xl">
                    {featuredPost.categories.length > 0 && (
                      <span className="inline-block bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                        {featuredPost.categories[0].category.name}
                      </span>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                      {featuredPost.title}
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <motion.a
                      href={`/posts/${featuredPost.slug}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition-all duration-200"
                    >
                      Read Article
                      <ArrowRight className="ml-2" size={20} />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Welcome to TheArtiBrain
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your premier destination for AI insights and tutorials
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-400 text-lg">
              Stay updated with the latest in AI and machine learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <ArticleCard {...post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Popular Topics
            </h2>
            <p className="text-gray-400 text-lg">
              Explore our most popular categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.a
                key={category.id}
                href={`/category/${category.slug}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:border-teal-500 transition-all duration-200 group"
              >
                <div className="text-2xl mb-3">🧠</div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-teal-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {category._count.posts} articles
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-teal-500/20 to-indigo-600/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12 text-center"
          >
            <Mail className="mx-auto mb-6 text-teal-400" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Get the latest AI insights, tutorials, and industry news delivered straight to your inbox. Join thousands of AI enthusiasts and professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition-all duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

