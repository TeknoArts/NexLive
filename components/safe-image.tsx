"use client"

import { useState } from "react"
import Image from "next/image"
import { getPlaceholderImage, getChannelPlaceholder } from "@/lib/placeholders"

interface SafeImageProps {
  src?: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  placeholderSeed?: string | number
  category?: string
  isChannel?: boolean
  channelIndex?: number
}

export function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  placeholderSeed,
  category,
  isChannel = false,
  channelIndex = 0,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (src) return src
    if (isChannel && category) {
      return getChannelPlaceholder(category, channelIndex)
    }
    if (placeholderSeed !== undefined) {
      return getPlaceholderImage(placeholderSeed, width || 400, height || 600, category)
    }
    return getPlaceholderImage(0, width || 400, height || 600, category)
  })
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Fallback to placeholder - use a different seed to get a different image
      const fallbackSeed = typeof placeholderSeed === 'number' ? placeholderSeed + 1000 : 0
      if (isChannel && category) {
        setImgSrc(getChannelPlaceholder(category, channelIndex))
      } else if (placeholderSeed !== undefined) {
        setImgSrc(getPlaceholderImage(fallbackSeed, width || 400, height || 600, category))
      } else {
        setImgSrc(getPlaceholderImage(fallbackSeed, width || 400, height || 600, category))
      }
    }
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        onError={handleError}
        unoptimized={false}
        priority={false}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 600}
      className={className}
      sizes={sizes}
      onError={handleError}
      unoptimized={false}
      priority={false}
    />
  )
}
