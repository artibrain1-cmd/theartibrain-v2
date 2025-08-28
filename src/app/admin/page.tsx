"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Users, FolderOpen, TrendingUp, Eye, Calendar } from "lucide-react"

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalUsers: number
  totalCategories: number
  totalTags: number
}

interface RecentPost {
  id: string
  title: string
  status: string
  publishedAt: string | null
  author: {
    name: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalTags: 0,
  })
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch posts
        const postsResponse = await fetch("/api/posts")
        const postsData = await postsResponse.json()
        
        // Fetch users
        const usersResponse = await fetch("/api/users")
        const usersData = await usersResponse.json()
        
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        const categoriesData = await categoriesResponse.json()
        
        // Fetch tags
        const tagsResponse = await fetch("/api/tags")
        const tagsData = await tagsResponse.json()

        setStats({
          totalPosts: postsData.length,
          publishedPosts: postsData.filter((p: any) => p.status === "PUBLISHED").length,
          draftPosts: postsData.filter((p: any) => p.status === "DRAFT").length,
          totalUsers: usersData.length,
          totalCategories: categoriesData.length,
          totalTags: tagsData.length,
        })

        setRecentPosts(postsData.slice(0, 5))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Published",
      value: stats.publishedPosts,
      icon: Eye,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Drafts",
      value: stats.draftPosts,
      icon: Calendar,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-500/20",
    },
    {
      title: "Tags",
      value: stats.totalTags,
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-500/20",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your blog.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Posts</h2>
          <a
            href="/admin/posts"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-200"
          >
            View all
          </a>
        </div>

        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{post.title}</h3>
                  <p className="text-gray-400 text-sm">
                    by {post.author.name} • {post.status}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === "PUBLISHED" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {post.status}
                  </span>
                  {post.publishedAt && (
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400">No posts yet. Create your first post!</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/posts/new"
            className="flex items-center justify-center p-4 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg hover:from-teal-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            <FileText className="mr-2 h-5 w-5" />
            New Post
          </a>
          <a
            href="/admin/categories"
            className="flex items-center justify-center p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            Manage Categories
          </a>
          <a
            href="/admin/users"
            className="flex items-center justify-center p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <Users className="mr-2 h-5 w-5" />
            Manage Users
          </a>
        </div>
      </motion.div>
    </div>
  )
}

