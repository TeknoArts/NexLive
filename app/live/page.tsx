"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Play } from "lucide-react"
import { motion } from "framer-motion"
import { SafeImage } from "@/components/safe-image"

export default function LiveTVPage() {
  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: () => api.channels.getAll(),
  })

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getActive(),
  })

  const categories = categoriesData.length > 0
    ? categoriesData.map((c: any) => c.name)
    : ['Sports', 'Education', 'Tourism', 'News']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20">
        <h1 className="text-5xl font-heading font-bold mb-12">Live TV</h1>
        
        {categories.map((category) => {
          const categoryChannels = channels.filter((c: any) => c.category?.name === category)
          if (categoryChannels.length === 0) return null
          
          return (
            <div key={category} className="mb-16">
              <h2 className="text-3xl font-heading font-semibold mb-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryChannels.map((channel: any, idx: number) => (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/live/${channel.id}`}>
                      <Card className="card-hover overflow-hidden cursor-pointer group">
                        <div className="relative aspect-video overflow-hidden">
                          <SafeImage
                            src={channel.thumbnail}
                            alt={channel.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            isChannel
                            category={channel.category?.name || category}
                            channelIndex={idx}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {channel.isLive && (
                            <>
                              <div className="absolute top-4 left-4 z-10">
                                <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                                  LIVE
                                </span>
                              </div>
                              <div className="absolute top-4 right-4 z-10">
                                <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-lg">
                                  {channel.viewers.toLocaleString()} viewers
                                </span>
                              </div>
                            </>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                              <Play className="h-12 w-12 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-5 bg-gradient-to-b from-card to-card/95">
                          <h3 className="font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors">{channel.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {channel.description || 'Live streaming channel'}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
