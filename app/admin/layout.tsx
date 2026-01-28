"use client"

import { Header } from "@/components/header"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  Tag, 
  Users, 
  Building2, 
  Ticket,
  FileText,
  Settings
} from "lucide-react"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/videos", label: "Videos", icon: Film },
  { href: "/admin/channels", label: "Channels", icon: Tv },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/partners", label: "Partners", icon: Building2 },
  { href: "/admin/vouchers", label: "Vouchers", icon: Ticket },
  { href: "/admin/audit", label: "Audit Logs", icon: FileText },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  // Check authentication on client side only
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      router.push('/auth/login')
      return
    }
    
    try {
      const userData = JSON.parse(user)
      if (userData.role !== 'ADMIN') {
        router.push('/app')
        return
      }
      setIsAuthenticated(true)
    } catch (e) {
      router.push('/auth/login')
    }
  }, [router])
  
  // Show loading state during authentication check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }
  
  if (isAuthenticated === false) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-2xl font-heading font-bold mb-6">Admin Panel</h2>
              <nav className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || 
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary border-l-4 border-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
