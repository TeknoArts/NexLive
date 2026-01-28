"use client"

import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/video-player"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"
import { Clock, Users } from "lucide-react"
import { format } from "date-fns"

export default function LivePlayerPage() {
  const params = useParams()
  const channelId = params.id as string

  const { data: channel, isLoading } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => api.channels.getOne(channelId),
  })

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', channelId],
    queryFn: () => fetch(`http://localhost:3001/schedules/channel/${channelId}?upcoming=true`).then(r => r.json()),
    enabled: !!channelId,
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

  if (!channel) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-heading">Channel not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <VideoPlayer
                src={channel.streamUrl}
                isLive={true}
                className="w-full aspect-video"
              />
              <div className="mt-4">
                <h1 className="text-3xl font-heading font-bold mb-2">{channel.name}</h1>
                <p className="text-muted-foreground">{channel.description}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Up Next</CardTitle>
              </CardHeader>
              <CardContent>
                {schedules.length > 0 ? (
                  <div className="space-y-4">
                    {schedules.map((schedule: any) => (
                      <div key={schedule.id} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{schedule.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(schedule.startTime), 'MMM d, h:mm a')} - {format(new Date(schedule.endTime), 'h:mm a')}
                          </p>
                          {schedule.description && (
                            <p className="text-sm text-muted-foreground mt-1">{schedule.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming schedules</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Viewers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{channel.viewers.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground mt-1">watching now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">$0.00</div>
                <Button className="w-full" size="sm">
                  Top Up
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

