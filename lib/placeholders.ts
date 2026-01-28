// Premium placeholder image generator with actual movie/content images
const MOVIE_POSTERS = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&q=80',
]

const CATEGORY_IMAGES: Record<string, string[]> = {
  'Animation': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop&q=80',
  ],
  'Fantasy': [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=640&h=360&fit=crop&q=80',
  ],
  'Sci-Fi': [
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=640&h=360&fit=crop&q=80',
  ],
  'Documentary': [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640&h=360&fit=crop&q=80',
  ],
  'Drama': [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop&q=80',
  ],
  'Comedy': [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop&q=80',
  ],
}

export function getPlaceholderImage(
  seed: string | number,
  width: number = 400,
  height: number = 600,
  category?: string
): string {
  const seedNum = typeof seed === 'number' ? seed : seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  // Use category-specific images if available
  if (category && CATEGORY_IMAGES[category]) {
    const images = CATEGORY_IMAGES[category]
    return images[seedNum % images.length]
  }
  
  // Use movie poster images
  if (width >= 600 || height >= 600) {
    // For larger images (posters), use movie theater images
    const posterImages = [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=' + width + '&h=' + height + '&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=' + width + '&h=' + height + '&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=' + width + '&h=' + height + '&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=' + width + '&h=' + height + '&fit=crop&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=' + width + '&h=' + height + '&fit=crop&q=80',
    ]
    return posterImages[seedNum % posterImages.length]
  }
  
  // For smaller images (thumbnails), use category-specific or generic
  if (category === 'Sports') {
    return `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=${width}&h=${height}&fit=crop&q=80`
  }
  if (category === 'Education') {
    return `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=${width}&h=${height}&fit=crop&q=80`
  }
  if (category === 'Tourism') {
    return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width}&h=${height}&fit=crop&q=80`
  }
  if (category === 'News') {
    return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=${width}&h=${height}&fit=crop&q=80`
  }
  
  // Default: use movie/cinema themed images
  const movieImages = [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=' + width + '&h=' + height + '&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=' + width + '&h=' + height + '&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=' + width + '&h=' + height + '&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=' + width + '&h=' + height + '&fit=crop&q=80',
  ]
  
  return movieImages[seedNum % movieImages.length]
}

export function getChannelPlaceholder(category: string, index: number): string {
  const width = 640
  const height = 360
  
  const categoryImages: Record<string, string[]> = {
    Sports: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=640&h=360&fit=crop&q=80',
    ],
    Education: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop&q=80',
    ],
    Tourism: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop&q=80',
    ],
    News: [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=640&h=360&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=640&h=360&fit=crop&q=80',
    ],
  }
  
  const images = categoryImages[category] || [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=640&h=360&fit=crop&q=80',
  ]
  
  return images[index % images.length]
}
