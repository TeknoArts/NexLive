"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Plus, Edit, Trash2, Save, X, Tv } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SafeImage } from "@/components/safe-image"

export default function AdminChannelsPage() {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    categoryId: "",
    streamUrl: "",
    thumbnail: "",
    isLive: false,
    isActive: true,
    partnerId: "",
  })

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['admin', 'channels'],
    queryFn: () => api.channels.getAllAdmin(),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.categories.getAll(),
  })

  const { data: partners = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: () => api.partners.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.channels.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'channels'] })
      setIsCreating(false)
      setFormData({
        name: "",
        description: "",
        category: "",
        categoryId: "",
        streamUrl: "",
        thumbnail: "",
        isLive: false,
        isActive: true,
        partnerId: "",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.channels.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'channels'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.channels.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'channels'] })
    },
  })

  const handleCreate = () => {
    if (!formData.name || !formData.streamUrl || !formData.partnerId) return
    createMutation.mutate(formData)
  }

  if (isLoading) {
    return <div className="animate-pulse space-y-4">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Channels</h1>
          <p className="text-muted-foreground">Manage live streaming channels</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Channel
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
                <CardTitle>Create New Channel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Channel name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Partner *</label>
                    <select
                      value={formData.partnerId}
                      onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select partner</option>
                      {partners.map((partner: any) => (
                        <option key={partner.id} value={partner.id}>{partner.name}</option>
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
                    placeholder="Channel description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Stream URL *</label>
                    <Input
                      value={formData.streamUrl}
                      onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                      placeholder="https://example.com/stream.m3u8"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://example.com/thumb.jpg"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isLive}
                      onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                    />
                    <span className="text-sm">Live</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="text-sm">Active</span>
                  </label>
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
        {channels.map((channel: any) => (
          <Card key={channel.id}>
            <div className="relative aspect-video overflow-hidden">
              <SafeImage
                src={channel.thumbnail}
                alt={channel.name}
                fill
                className="object-cover"
                isChannel
                category={channel.category?.name || 'Uncategorized'}
                channelIndex={0}
              />
              {channel.isLive && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full animate-pulse">
                    LIVE
                  </span>
                </div>
              )}
              {!channel.isActive && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                    Inactive
                  </span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              {editingId === channel.id ? (
                <ChannelEditForm
                  channel={channel}
                  categories={categories}
                  onSave={(data: any) => updateMutation.mutate({ id: channel.id, data })}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{channel.name}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(channel.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(`Delete channel "${channel.name}"?`)) {
                            deleteMutation.mutate(channel.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <p>{channel.category?.name || 'Uncategorized'}</p>
                    <p className="flex items-center gap-1 mt-1">
                      <Tv className="h-3 w-3" />
                      {channel.viewers?.toLocaleString() || 0} viewers
                    </p>
                  </div>
                  {channel.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>
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

function ChannelEditForm({ channel, categories, onSave, onCancel }: any) {
  const [data, setData] = useState({
    name: channel.name,
    description: channel.description || "",
    category: channel.category || "",
    categoryId: channel.categoryId || "",
    streamUrl: channel.streamUrl,
    thumbnail: channel.thumbnail || "",
    isLive: channel.isLive || false,
    isActive: channel.isActive !== undefined ? channel.isActive : true,
  })

  return (
    <div className="space-y-3">
      <Input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="Channel name"
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
        value={data.streamUrl}
        onChange={(e) => setData({ ...data, streamUrl: e.target.value })}
        placeholder="Stream URL"
      />
      <Input
        value={data.thumbnail}
        onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
        placeholder="Thumbnail URL"
      />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.isLive}
            onChange={(e) => setData({ ...data, isLive: e.target.checked })}
          />
          <span className="text-sm">Live</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => setData({ ...data, isActive: e.target.checked })}
          />
          <span className="text-sm">Active</span>
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
