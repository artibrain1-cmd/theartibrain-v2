"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

interface Author {
  id: string
  name: string
  email: string
  avatarUrl?: string
  bio?: string
  _count?: {
    posts: number
  }
}

export default function AuthorPage() {
  const params = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts by this author
        const postsResponse = await fetch(`/api/posts?authorId=${params.id}&status=PUBLISHED`)
        const postsData = await postsResponse.json()
        setPosts(postsData)

        // Fetch author info
        const authorResponse = await fetch(`/api/users/${params.id}`)
        if (authorResponse.ok) {
          const authorData = await authorResponse.json()
          setAuthor({
            ...authorData,
            _count: { posts: postsData.length }
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Author not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-teal-400 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Author Header */}
        <header className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {author.avatarUrl ? (
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-30 h-30 bg-gray-700 rounded-full flex items-center justify-center">
                    <User size={60} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {author.name}
                </h1>
                
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {author.bio || "AI enthusiast and technology writer passionate about sharing insights on artificial intelligence and machine learning."}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400">
                  <div>
                    <span className="font-semibold text-teal-400">
                      {author._count?.posts || 0}
                    </span>
                    <span className="ml-1">
                      {author._count?.posts === 1 ? "Article" : "Articles"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Articles Section */}
        <section className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-white mb-8"
          >
            Articles by {author.name}
          </motion.h2>

          {posts.length > 0 ? (
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
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">✍️</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No articles yet
              </h3>
              <p className="text-gray-400 text-lg">
                {author.name} hasn't published any articles yet.
              </p>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

