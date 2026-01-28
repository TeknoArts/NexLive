"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Users, Building2, Ticket, FileText, Film, Tv, Tag } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const [categories, videos, channels, partners] = await Promise.all([
        api.categories.getAll().catch(() => []),
        api.vod.getAllAdmin().catch(() => []),
        api.channels.getAllAdmin().catch(() => []),
        api.partners.getAll().catch(() => []),
      ])
      return { categories, videos, channels, partners }
    },
  })

  const [voucherCode, setVoucherCode] = useState("")
  const [voucherAmount, setVoucherAmount] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform content and settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl font-bold">1,234</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Partners</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vouchers</p>
                  <p className="text-3xl font-bold">20</p>
                </div>
                <Ticket className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Audit Logs</p>
                  <p className="text-3xl font-bold">5,678</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/admin/categories">
                  <Tag className="mr-2 h-4 w-4" />
                  Manage Categories
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/videos">
                  <Film className="mr-2 h-4 w-4" />
                  Manage Videos
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/channels">
                  <Tv className="mr-2 h-4 w-4" />
                  Manage Channels
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search users..." />
                  <Button variant="outline">Search</Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>User management coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partners Management */}
          <Card>
            <CardHeader>
              <CardTitle>Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search partners..." />
                  <Button variant="outline">Search</Button>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  Partner management interface
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Management */}
          <Card>
            <CardHeader>
              <CardTitle>Voucher Batches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Generate Vouchers</label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount per voucher"
                    value={voucherAmount}
                    onChange={(e) => setVoucherAmount(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                  />
                  <Button className="w-full">Generate Batch</Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-2">Recent Batches</h3>
                <div className="text-sm text-muted-foreground">
                  Voucher batch history will appear here
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Filter logs..." />
                  <Button variant="outline">Filter</Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">User Action</span>
                        <span className="text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        User performed action on resource
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
