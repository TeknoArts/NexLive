"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
    sortOrder: 0,
  })

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.categories.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
      setIsCreating(false)
      setFormData({ name: "", slug: "", description: "", image: "", isActive: true, sortOrder: 0 })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
  })

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleCreate = () => {
    if (!formData.name) return
    const slug = formData.slug || generateSlug(formData.name)
    createMutation.mutate({ ...formData, slug })
  }

  const handleUpdate = (id: string, data: any) => {
    if (data.slug && !data.slug.match(/^[a-z0-9-]+$/)) {
      data.slug = generateSlug(data.name || categories.find((c: any) => c.id === id)?.name)
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
          <h1 className="text-4xl font-heading font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage content categories</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
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
                <CardTitle>Create New Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })
                      }}
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="category-slug"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Category description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Sort Order:</label>
                    <Input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
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
        {categories.map((category: any) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              {editingId === category.id ? (
                <CategoryEditForm
                  category={category}
                  onSave={(data: any) => handleUpdate(category.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(category.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(`Delete category "${category.name}"?`)) {
                            deleteMutation.mutate(category.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className={category.isActive ? "text-green-500" : "text-red-500"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-muted-foreground">Order: {category.sortOrder}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CategoryEditForm({ category, onSave, onCancel }: any) {
  const [data, setData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    image: category.image || "",
    isActive: category.isActive,
    sortOrder: category.sortOrder,
  })

  return (
    <div className="space-y-4">
      <Input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="Category name"
      />
      <Input
        value={data.slug}
        onChange={(e) => setData({ ...data, slug: e.target.value })}
        placeholder="slug"
      />
      <textarea
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="Description"
      />
      <Input
        value={data.image}
        onChange={(e) => setData({ ...data, image: e.target.value })}
        placeholder="Image URL"
      />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => setData({ ...data, isActive: e.target.checked })}
          />
          <span className="text-sm">Active</span>
        </label>
        <Input
          type="number"
          value={data.sortOrder}
          onChange={(e) => setData({ ...data, sortOrder: parseInt(e.target.value) || 0 })}
          className="w-20"
        />
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
