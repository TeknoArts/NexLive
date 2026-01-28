"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Tv, Film, Eye, Clock, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function PartnerPortalPage() {
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      router.push('/auth/login')
      return
    }
    
    try {
      const userData = JSON.parse(user)
      if (userData.role !== 'PARTNER' && userData.role !== 'ADMIN') {
        router.push('/app')
      }
    } catch (e) {
      router.push('/auth/login')
    }
  }, [router])

  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['analytics', 'partner'],
    queryFn: () => api.analytics.getPartnerDashboard(),
    retry: false,
  })

  const { data: partner, isLoading: partnerLoading, error: partnerError } = useQuery({
    queryKey: ['partner', 'portal'],
    queryFn: () => api.partners.getMyPortal(),
    retry: false,
  })

  const regionData = dashboard?.topRegions?.map((r: any) => ({
    name: r.region,
    value: r.views,
  })) || []

  if (dashboardLoading || partnerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-20 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (dashboardError || partnerError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-heading font-semibold mb-4">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                You need to be logged in as a partner to access this portal.
              </p>
              <Button asChild>
                <a href="/auth/login">Go to Login</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20">
        <h1 className="text-5xl font-heading font-bold mb-12">Partner Portal</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                  <p className="text-3xl font-bold">{dashboard?.totalViews?.toLocaleString() || 0}</p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Watch Minutes</p>
                  <p className="text-3xl font-bold">{dashboard?.watchMinutes?.toLocaleString() || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Channels</p>
                  <p className="text-3xl font-bold">{dashboard?.activeChannels || 0} / {dashboard?.totalChannels || 0}</p>
                </div>
                <Tv className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">VOD Items</p>
                  <p className="text-3xl font-bold">{dashboard?.totalVodItems || 0}</p>
                </div>
                <Film className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {dashboard?.error && (
          <Card className="mb-12 border-destructive/50 bg-destructive/10">
            <CardContent className="p-6">
              <p className="text-destructive">{dashboard.error}</p>
              {dashboard.details && (
                <p className="text-sm text-muted-foreground mt-2">{dashboard.details}</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Regions Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Top Regions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {regionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {regionData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No region data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Mon', views: 1200 },
                  { name: 'Tue', views: 1900 },
                  { name: 'Wed', views: 3000 },
                  { name: 'Thu', views: 2780 },
                  { name: 'Fri', views: 1890 },
                  { name: 'Sat', views: 2390 },
                  { name: 'Sun', views: 3490 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Go Live Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Go Live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">RTMP Ingest URL</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`rtmp://ingest.nexlive.local/live/${partner?.streamKey || 'your-stream-key'}`}
                  className="font-mono text-sm"
                />
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(`rtmp://ingest.nexlive.local/live/${partner?.streamKey || 'your-stream-key'}`)
                }}>
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SRT Ingest URL</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`srt://ingest.nexlive.local:9000?streamid=${partner?.streamKey || 'your-stream-key'}`}
                  className="font-mono text-sm"
                />
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(`srt://ingest.nexlive.local:9000?streamid=${partner?.streamKey || 'your-stream-key'}`)
                }}>
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WebRTC Ingest URL</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="https://webrtc.nexlive.local/ingest"
                  className="font-mono text-sm"
                />
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText('https://webrtc.nexlive.local/ingest')
                }}>
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Calendar */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Schedule Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              Schedule management coming soon
            </div>
          </CardContent>
        </Card>

        {/* VOD Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload VOD Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input placeholder="Enter video title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Enter video description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input placeholder="e.g., Animation, Documentary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Video File</label>
              <Input type="file" accept="video/*" />
            </div>
            <Button className="w-full">Upload Video</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
