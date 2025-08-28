"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Clock, User } from "lucide-react"

interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  featuredImage?: string
  author: {
    name: string
    avatarUrl?: string
  }
  publishedAt: string
  categories: Array<{
    category: {
      name: string
      slug: string
    }
  }>
  slug: string
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  featuredImage,
  author,
  publishedAt,
  categories,
  slug,
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const estimateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.split(" ").length
    return Math.ceil(words / wordsPerMinute)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-teal-500/50 transition-all duration-300"
    >
      <Link href={`/posts/${slug}`}>
        <div className="relative h-48 overflow-hidden">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-indigo-600/20 flex items-center justify-center">
              <span className="text-4xl text-teal-400">📄</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
          
          {/* Category Badge */}
          {categories.length > 0 && (
            <div className="absolute top-4 left-4">
              <span className="bg-teal-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                {categories[0].category.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
          
          <p className="text-gray-400 mb-4 line-clamp-3">
            {excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {author.avatarUrl ? (
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                ) : (
                  <User size={16} />
                )}
                <span>{author.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{formatDate(publishedAt)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{estimateReadingTime(excerpt)} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

