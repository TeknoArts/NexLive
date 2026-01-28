"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Play, Plus, Wallet, History, List } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { SafeImage } from "@/components/safe-image"

export default function ViewerAppPage() {
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.wallet.get(),
  })

  const [topUpAmount, setTopUpAmount] = useState("")

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount)
    if (amount > 0) {
      try {
        await api.wallet.topUp(amount)
        setTopUpAmount("")
        // Refetch wallet data
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      } catch (error) {
        console.error('Top-up failed:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20">
        <h1 className="text-5xl font-heading font-bold mb-12">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Continue Watching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="cursor-pointer group">
                      <div className="aspect-video rounded-lg mb-2 relative overflow-hidden">
                        <SafeImage
                          alt={`Video ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          placeholderSeed={i}
                          width={400}
                          height={225}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[45%] rounded-full" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/70 backdrop-blur-sm rounded-full p-3">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">Video {i + 1}</p>
                      <p className="text-xs text-muted-foreground">45% watched</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <List className="h-5 w-5 mr-2" />
                  Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="cursor-pointer group">
                      <div className="aspect-video rounded-lg mb-2 relative overflow-hidden">
                        <SafeImage
                          alt={`Watchlist Item ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          placeholderSeed={i + 10}
                          width={400}
                          height={225}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/70 backdrop-blur-sm rounded-full p-3">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">Watchlist Item {i + 1}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {formatCurrency(wallet?.balance || 0, wallet?.currency || 'USD')}
                  </div>
                  <p className="text-sm text-muted-foreground">Available balance</p>
                </div>

                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                  <Button className="w-full" onClick={handleTopUp}>
                    Top Up
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-2">Recent Transactions</h3>
                  <div className="space-y-2">
                    {wallet?.transactions?.slice(0, 5).map((tx: any) => (
                      <div key={tx.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{tx.description || tx.type}</span>
                        <span className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, wallet?.currency || 'USD')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voucher Redemption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input placeholder="Enter voucher code" />
                  <Button className="w-full" variant="outline">
                    Redeem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
