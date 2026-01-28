"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useState } from "react"
import { Search, Play, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { SafeImage } from "@/components/safe-image"
import { formatDuration } from "@/lib/utils"

export default function VODPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  const { data: vodItems = [], isLoading } = useQuery({
    queryKey: ['vod', selectedCategory, searchQuery],
    queryFn: () => api.vod.getAll(selectedCategory, searchQuery || undefined),
  })

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getActive(),
  })

  const categories = categoriesData.length > 0 
    ? categoriesData.map((c: any) => c.name)
    : ['Animation', 'Fantasy', 'Sci-Fi', 'Documentary', 'Drama', 'Comedy']

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-heading font-bold mb-6">VOD Library</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Discover premium content across all categories. Stream anytime, anywhere.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(undefined)}
              className={selectedCategory === undefined ? "shadow-md" : ""}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "shadow-md" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-muted via-muted/80 to-muted" />
                <CardContent className="p-5">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : vodItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No videos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vodItems.map((item: any, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/vod/${item.id}`}>
                  <Card className="card-hover overflow-hidden cursor-pointer group h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
                      <SafeImage
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        placeholderSeed={item.id}
                        category={item.category?.name || 'Uncategorized'}
                        width={640}
                        height={360}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-black/80 backdrop-blur-md rounded-full p-5 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl border-2 border-white/20">
                          <Play className="h-12 w-12 text-white fill-white" />
                        </div>
                      </div>
                      
                      {/* Category badge */}
                      {item.category && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-md border border-white/10">
                            {item.category.name || item.category}
                          </span>
                        </div>
                      )}
                      
                      {/* Duration badge */}
                      {item.duration && (
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-md border border-white/10">
                            {formatDuration(item.duration)}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 bg-gradient-to-b from-card via-card to-card/95 flex-1 flex flex-col">
                      <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="font-medium">{item.views?.toLocaleString() || 0}</span>
                        </div>
                        <div className="text-xs text-primary/80 font-semibold group-hover:text-primary transition-colors">
                          Watch →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
