"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

export default function CategoryPage() {
  const params = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts for this category
        const postsResponse = await fetch(`/api/posts?categorySlug=${params.slug}&status=PUBLISHED`)
        const postsData = await postsResponse.json()
        setPosts(postsData)

        // Fetch category info
        const categoriesResponse = await fetch("/api/categories")
        const categoriesData = await categoriesResponse.json()
        const currentCategory = categoriesData.find((cat: Category) => cat.slug === params.slug)
        setCategory(currentCategory)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchData()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Category not found</div>
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

        {/* Category Header */}
        <header className="container mx-auto px-4 mb-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block bg-teal-500 text-white px-6 py-3 rounded-full text-lg font-medium mb-4">
                {category.name}
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {category.name} Articles
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg"
            >
              {category._count.posts} articles in this category
            </motion.p>
          </div>
        </header>

        {/* Articles Grid */}
        <section className="container mx-auto px-4">
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
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No articles yet
              </h2>
              <p className="text-gray-400 text-lg">
                Articles in the {category.name} category will appear here.
              </p>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

