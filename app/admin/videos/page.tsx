"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Plus, Edit, Trash2, Save, X, Play, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SafeImage } from "@/components/safe-image"
import { formatDuration } from "@/lib/utils"

export default function AdminVideosPage() {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    duration: 0,
    category: "",
    categoryId: "",
    tags: "",
    isActive: true,
    isFeatured: false,
  })

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin', 'videos'],
    queryFn: () => api.vod.getAllAdmin(),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.categories.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.vod.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'videos'] })
      setIsCreating(false)
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        thumbnail: "",
        duration: 0,
        category: "",
        categoryId: "",
        tags: "",
        isActive: true,
        isFeatured: false,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.vod.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'videos'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.vod.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'videos'] })
    },
  })

  const handleCreate = () => {
    if (!formData.title || !formData.videoUrl) return
    const duration = formData.duration || 0
    const tags = formData.tags ? JSON.stringify(formData.tags.split(',').map(t => t.trim())) : null
    createMutation.mutate({
      ...formData,
      duration,
      tags,
    })
  }

  const handleUpdate = (id: string, data: any) => {
    if (data.tags && typeof data.tags === 'string') {
      data.tags = JSON.stringify(data.tags.split(',').map((t: string) => t.trim()))
    }
    updateMutation.mutate({ id, data })
  }

  if (isLoading) {
    return <div className="animate-pulse space-y-4">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Videos</h1>
          <p className="text-muted-foreground">Manage VOD content</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Video title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        const cat = categories.find((c: any) => c.id === e.target.value)
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                          category: cat?.name || "",
                        })
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Video description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Video URL *</label>
                    <Input
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                    <Input
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://example.com/thumb.jpg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      placeholder="600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="action, drama, thriller"
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video: any) => (
          <Card key={video.id}>
            <div className="relative aspect-video overflow-hidden">
              <SafeImage
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
                placeholderSeed={video.id}
                category={video.category?.name || 'Uncategorized'}
                width={400}
                height={225}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {video.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                    Featured
                  </span>
                )}
                {!video.isActive && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                    Inactive
                  </span>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              {editingId === video.id ? (
                <VideoEditForm
                  video={video}
                  categories={categories}
                  onSave={(data: any) => handleUpdate(video.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(video.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(`Delete video "${video.title}"?`)) {
                            deleteMutation.mutate(video.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{video.category?.name || 'Uncategorized'}</span>
                    {video.duration > 0 && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(video.duration)}</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views?.toLocaleString() || 0}
                    </span>
                  </div>
                  {video.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function VideoEditForm({ video, categories, onSave, onCancel }: any) {
  const [data, setData] = useState({
    title: video.title,
    description: video.description || "",
    videoUrl: video.videoUrl,
    thumbnail: video.thumbnail || "",
    duration: video.duration || 0,
    category: video.category || "",
    categoryId: video.categoryId || "",
    tags: video.tags ? (typeof video.tags === 'string' ? JSON.parse(video.tags).join(', ') : video.tags.join(', ')) : "",
    isActive: video.isActive !== undefined ? video.isActive : true,
    isFeatured: video.isFeatured || false,
  })

  return (
    <div className="space-y-3">
      <Input
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="Title"
      />
      <select
        value={data.categoryId}
        onChange={(e) => {
          const cat = categories.find((c: any) => c.id === e.target.value)
          setData({
            ...data,
            categoryId: e.target.value,
            category: cat?.name || "",
          })
        }}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Select category</option>
        {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <textarea
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="Description"
      />
      <Input
        value={data.videoUrl}
        onChange={(e) => setData({ ...data, videoUrl: e.target.value })}
        placeholder="Video URL"
      />
      <Input
        value={data.thumbnail}
        onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
        placeholder="Thumbnail URL"
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          value={data.duration}
          onChange={(e) => setData({ ...data, duration: parseInt(e.target.value) || 0 })}
          placeholder="Duration (sec)"
        />
        <Input
          value={data.tags}
          onChange={(e) => setData({ ...data, tags: e.target.value })}
          placeholder="Tags"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => setData({ ...data, isActive: e.target.checked })}
          />
          <span className="text-sm">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.isFeatured}
            onChange={(e) => setData({ ...data, isFeatured: e.target.checked })}
          />
          <span className="text-sm">Featured</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(data)}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
