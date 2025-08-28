"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  slug: string
  status: string
  publishedAt: string | null
  createdAt: string
  author: {
    name: string
  }
  categories: Array<{
    category: {
      name: string
    }
  }>
}

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts")
        const data = await response.json()
        setPosts(data)
        setFilteredPosts(data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(post => post.status === statusFilter)
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, statusFilter])

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PUBLISHED: "bg-green-500/20 text-green-400",
      DRAFT: "bg-yellow-500/20 text-yellow-400",
      SCHEDULED: "bg-blue-500/20 text-blue-400",
    }
    return styles[status as keyof typeof styles] || "bg-gray-500/20 text-gray-400"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading posts...</div>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Posts</h1>
          <p className="text-gray-400">Manage your blog posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 mt-4 sm:mt-0"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Post
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors appearance-none"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Posts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
      >
        {filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-white font-medium">{post.title}</h3>
                        <p className="text-gray-400 text-sm">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{post.author.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {post.categories.length > 0 ? post.categories[0].category.name : "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {post.publishedAt 
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : new Date(post.createdAt).toLocaleDateString()
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {post.status === "PUBLISHED" && (
                          <Link
                            href={`/posts/${post.slug}`}
                            className="p-2 text-gray-400 hover:text-teal-400 transition-colors duration-200"
                            title="View Post"
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                          title="Edit Post"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-white font-medium mb-2">No posts found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "ALL" 
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first post."
              }
            </p>
            {!searchTerm && statusFilter === "ALL" && (
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-indigo-700 transition-all duration-200"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create First Post
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

