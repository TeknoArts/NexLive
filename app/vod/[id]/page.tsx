"use client"

import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/video-player"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"
import { Play, Plus, Heart } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { SafeImage } from "@/components/safe-image"

export default function VODDetailPage() {
  const params = useParams()
  const vodId = params.id as string

  const { data: item, isLoading } = useQuery({
    queryKey: ['vod', vodId],
    queryFn: () => api.vod.getOne(vodId),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="aspect-video bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-heading">Video not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <VideoPlayer
            src={item.videoUrl}
            className="w-full aspect-video"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-heading font-bold mb-4">{item.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-muted-foreground">{item.category}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{formatDuration(item.duration)}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{item.views.toLocaleString()} views</span>
            </div>

            <div className="flex gap-4 mb-8">
              <Button size="lg">
                <Play className="mr-2 h-5 w-5" />
                Play
              </Button>
              <Button size="lg" variant="outline">
                Rent (Demo)
              </Button>
              <Button size="lg" variant="outline">
                <Plus className="mr-2 h-5 w-5" />
                Add to Watchlist
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-heading font-semibold mb-4">Related Content</h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 cursor-pointer group hover:opacity-90 transition-all">
                      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <SafeImage
                          alt={`Related Video ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="96px"
                          placeholderSeed={i + 100}
                          category={item.category?.name || 'Uncategorized'}
                          width={96}
                          height={64}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">Related Video {i + 1}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.category?.name || 'Uncategorized'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
