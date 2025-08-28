"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Post {
  id: string
  title: string
  slug: string
  content: any
  excerpt: string
  featuredImage?: string
  publishedAt: string
  author: {
    name: string
    avatarUrl?: string
    bio?: string
  }
  categories: Array<{
    category: {
      name: string
      slug: string
    }
  }>
  tags: Array<{
    tag: {
      name: string
      slug: string
    }
  }>
}

export default function ArticlePage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        if (response.ok) {
          const postData = await response.json()
          setPost(postData)
          
          // Fetch related posts
          if (postData.categories.length > 0) {
            const relatedResponse = await fetch(
              `/api/posts?categorySlug=${postData.categories[0].category.slug}&limit=3`
            )
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json()
              setRelatedPosts(relatedData.filter((p: Post) => p.id !== postData.id).slice(0, 3))
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPost()
    }
  }, [params.slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const estimateReadingTime = (content: any) => {
    const wordsPerMinute = 200
    const text = JSON.stringify(content)
    const words = text.split(" ").length
    return Math.ceil(words / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Article not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <article className="pt-24 pb-16">
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

        {/* Article Header */}
        <header className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="mb-6">
                {post.categories.map((cat) => (
                  <span
                    key={cat.category.slug}
                    className="inline-block bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mr-2"
                  >
                    {cat.category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              {post.title}
            </motion.h1>

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center gap-6 text-gray-400 mb-8"
            >
              <div className="flex items-center space-x-2">
                {post.author.avatarUrl ? (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User size={20} />
                )}
                <span>{post.author.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar size={20} />
                <span>{formatDate(post.publishedAt)}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Clock size={20} />
                <span>{estimateReadingTime(post.content)} min read</span>
              </div>
            </motion.div>

            {/* Featured Image */}
            {post.featuredImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12"
              >
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              {/* Render content - this would need a proper rich text renderer */}
              <div className="text-gray-300 leading-relaxed text-lg">
                {post.excerpt}
              </div>
              
              {/* Placeholder for rich content */}
              <div className="mt-8 space-y-6 text-gray-300 leading-relaxed">
                <p>
                  This is where the rich content from the editor would be rendered. 
                  The content is stored as JSON and would need a proper renderer 
                  to display formatted text, code blocks, images, etc.
                </p>
                <p>
                  For now, this is a placeholder showing how the article layout 
                  would look with proper styling and typography.
                </p>
              </div>
            </motion.div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-gray-700"
              >
                <h3 className="text-white font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.tag.slug}
                      href={`/tag/${tag.tag.slug}`}
                      className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors duration-200"
                    >
                      #{tag.tag.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Author Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl"
            >
              <div className="flex items-start space-x-4">
                {post.author.avatarUrl ? (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {post.author.name}
                  </h3>
                  <p className="text-gray-400">
                    {post.author.bio || "AI enthusiast and technology writer passionate about sharing insights on artificial intelligence and machine learning."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-3xl font-bold text-white mb-8 text-center"
              >
                Related Articles
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  >
                    <Link
                      href={`/posts/${relatedPost.slug}`}
                      className="block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-teal-500/50 transition-all duration-300 group"
                    >
                      {relatedPost.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-white font-semibold mb-2 group-hover:text-teal-400 transition-colors duration-200">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  )
}

