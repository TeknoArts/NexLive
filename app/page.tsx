"use client"

import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Play, Tv, Film, CreditCard, Smartphone, Monitor } from "lucide-react"
import { motion } from "framer-motion"
import { VIDEO_CONFIG } from "@/config/videos"
import { SafeImage } from "@/components/safe-image"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

function LiveChannelsSection() {
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getActive(),
  })

  const categories = categoriesData.length > 0
    ? categoriesData.map((c: any) => c.name)
    : ['Sports', 'Education', 'Tourism', 'News']

  return (
    <section className="py-24 container">
      <h2 className="text-4xl font-heading font-bold mb-12">Live Linear Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="card-hover overflow-hidden group">
              <div className="relative aspect-video overflow-hidden">
                <SafeImage
                  alt={`${category} Channel`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  isChannel
                  category={category}
                  channelIndex={idx}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                    LIVE
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                    <Play className="h-12 w-12 text-white fill-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-5 bg-gradient-to-b from-card to-card/95">
                <h3 className="font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors">{category} Channel</h3>
                <p className="text-sm text-muted-foreground">Live streaming now</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[800px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <VideoPlayer
            src={VIDEO_CONFIG.vod.bigBuckBunny}
            autoplay
            muted
            controls={false}
            className="w-full h-full object-cover scale-110"
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
        <div className="absolute inset-0 premium-gradient opacity-30 z-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
        
        {/* Content */}
        <div className="relative z-20 container h-full flex flex-col items-center justify-center text-center space-y-10 px-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white/90">Live Streaming Now</span>
          </motion.div>
          
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-7xl md:text-9xl font-heading font-bold text-white leading-none tracking-tight">
              <span className="block bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                NexLive
              </span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary via-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>
          
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-2 max-w-3xl"
          >
            <p className="text-2xl md:text-4xl font-heading font-semibold text-white leading-tight">
              Enterprise Streaming.
            </p>
            <p className="text-2xl md:text-4xl font-heading font-semibold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fully Sovereign.
            </p>
            <p className="text-lg md:text-xl text-white/70 font-light mt-4 max-w-2xl mx-auto">
              Premium OTT platform designed for governments, broadcasters, and enterprises worldwide.
            </p>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 hover:scale-105" 
              asChild
            >
              <Link href="/live">
                <Tv className="mr-2 h-6 w-6" />
                Watch Live
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:border-white/50" 
              asChild
            >
              <Link href="/vod">
                <Film className="mr-2 h-6 w-6" />
                Browse VOD
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:border-white/50" 
              asChild
            >
              <Link href="/partner">
                Partner Portal
              </Link>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-8 border-t border-white/10"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">12+</div>
              <div className="text-sm text-white/70">Live Channels</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">24+</div>
              <div className="text-sm text-white/70">VOD Titles</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/70">Sovereign</div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white/60 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Live Linear Channels */}
      <LiveChannelsSection />

      {/* Interactive Live Sessions */}
      <section className="py-24 bg-gradient-to-b from-muted/30 via-muted/20 to-background">
        <div className="container">
          <h2 className="text-4xl font-heading font-bold mb-12">Interactive Live Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Sports Events', desc: 'Live matches and tournaments', icon: '⚽' },
              { title: 'Education', desc: 'Interactive learning sessions', icon: '📚' },
              { title: 'Tourism', desc: 'Virtual tours and destinations', icon: '🌍' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="card-hover premium-border group">
                  <CardContent className="p-8">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VOD Library */}
      <section className="py-24 container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-heading font-bold">VOD Library</h2>
          <Button variant="outline" asChild className="border-border/50 hover:border-primary/50">
            <Link href="/vod">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Big Buck Bunny', category: 'Animation', desc: 'A lovable rabbit adventure' },
            { title: 'Sintel', category: 'Fantasy', desc: 'Epic fantasy journey' },
            { title: 'Tears of Steel', category: 'Sci-Fi', desc: 'Post-apocalyptic action' },
            { title: 'Elephants Dream', category: 'Animation', desc: 'Surreal mechanical world' },
            { title: 'Cosmic Voyage', category: 'Documentary', desc: 'Exploring the universe' },
            { title: 'City Lights', category: 'Drama', desc: 'Urban stories unfold' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href="/vod">
                <Card className="card-hover overflow-hidden cursor-pointer group">
                  <div className="relative aspect-video overflow-hidden">
                    <SafeImage
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      placeholderSeed={idx}
                      category={item.category || 'Uncategorized'}
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
                  </div>
                  <CardContent className="p-5 bg-gradient-to-b from-card via-card to-card/95 flex-1 flex flex-col">
                    <h3 className="font-semibold text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1 leading-relaxed">
                      {item.desc}
                    </p>
                    <p className="text-xs font-medium text-primary/80 mt-auto">{item.category}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Monetization */}
      <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-muted/30">
        <div className="container">
          <h2 className="text-4xl font-heading font-bold mb-12 text-center">Monetization Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'PayPal', desc: 'Secure payment processing', icon: CreditCard },
              { title: 'Stripe', desc: 'Global payment gateway', icon: CreditCard },
              { title: 'Prepaid Vouchers', desc: 'Africa-ready payment solution', icon: CreditCard },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="card-hover premium-border group h-full">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Device Coverage */}
      <section className="py-24 container">
        <h2 className="text-4xl font-heading font-bold mb-12 text-center">Device Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Web', desc: 'Full browser support', icon: Monitor },
            { title: 'Mobile', desc: 'iOS & Android apps', icon: Smartphone },
            { title: 'Smart TVs', desc: 'All major platforms', icon: Tv },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="card-hover premium-border group h-full">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient opacity-50" />
        <div className="container text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-heading font-bold mb-6"
          >
            Built for Governments, Broadcasters & Enterprises
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Fully sovereign, enterprise-grade streaming platform designed for scale and security.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button size="lg" asChild className="text-lg px-8 py-6 premium-glow">
              <Link href="/contact">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
