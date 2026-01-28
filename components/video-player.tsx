"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  isLive?: boolean
  className?: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
}

export function VideoPlayer({
  src,
  isLive = false,
  className,
  autoplay = false,
  muted = false,
  controls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isHLS = src.includes('.m3u8') || isLive

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (isHLS) {
      // Handle HLS streams
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: isLive,
        })
        hlsRef.current = hls

        hls.loadSource(src)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoplay) {
            video.play().catch((err) => {
              console.error('Autoplay failed:', err)
              setError('Autoplay blocked. Click play to start.')
            })
          }
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS error:', data)
            setError('Failed to load video stream')
          }
        })

        return () => {
          hls.destroy()
        }
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = src
        if (autoplay) {
          video.play().catch(() => {})
        }
      } else {
        setError('HLS not supported in this browser')
      }
    } else {
      // Handle regular MP4 videos
      video.src = src
      video.load()
      if (autoplay) {
        video.play().catch(() => {
          setError('Autoplay blocked. Click play to start.')
        })
      }
    }

    // Set muted state
    video.muted = isMuted

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src, autoplay, isLive, isHLS, isMuted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleLoadedMetadata = () => setError(null)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', () => {
      setError('Failed to load video')
    })

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch((err) => {
        console.error('Play failed:', err)
        setError('Failed to play video')
      })
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!document.fullscreenElement) {
      video.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }

  return (
    <div 
      className={cn("relative w-full bg-black rounded-lg overflow-hidden group", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        muted={isMuted}
        onClick={togglePlay}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center text-white p-4">
            <p className="mb-4">{error}</p>
            <Button onClick={togglePlay}>Try Again</Button>
          </div>
        </div>
      )}
      
      {controls && showControls && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none z-10">
          <div className="flex items-center space-x-4 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
          
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      {isLive && (
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full animate-pulse">
            LIVE
          </span>
        </div>
      )}
    </div>
  )
}
