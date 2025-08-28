"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Tags, 
  FolderOpen, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Check if user has admin/editor/author role
    if (!["ADMIN", "EDITOR", "AUTHOR"].includes(session.user.role)) {
      router.push("/")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["ADMIN", "EDITOR", "AUTHOR"]
    },
    {
      name: "Posts",
      href: "/admin/posts",
      icon: FileText,
      roles: ["ADMIN", "EDITOR", "AUTHOR"]
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
      roles: ["ADMIN", "EDITOR"]
    },
    {
      name: "Tags",
      href: "/admin/tags",
      icon: Tags,
      roles: ["ADMIN", "EDITOR"]
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      roles: ["ADMIN"]
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["ADMIN"]
    },
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(session.user.role)
  )

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-white">TheArtiBrain</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200 group"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="px-4 py-3">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="text-sm font-medium text-white">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.role}</p>
            </div>
            <button
              onClick={() => router.push("/api/auth/signout")}
              className="flex items-center w-full px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

