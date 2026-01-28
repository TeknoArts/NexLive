"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await api.auth.login(email, password)
      if (response && response.access_token) {
        localStorage.setItem("token", response.access_token)
        localStorage.setItem("user", JSON.stringify(response.user))
        
        // Redirect based on role
        if (response.user.role === "ADMIN") {
          router.push("/admin")
        } else if (response.user.role === "PARTNER") {
          router.push("/partner")
        } else {
          router.push("/app")
        }
      } else {
        setError("Invalid response from server. Please try again.")
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err?.message || err?.error?.message || "Invalid credentials"
      setError(`${errorMessage}. Try: viewer@nexlive.test / Demo123!`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading">Welcome to NexLive</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@nexlive.test"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center mb-2">Demo Accounts:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Viewer: viewer@nexlive.test / Demo123!</p>
                  <p>Partner: partner@nexlive.test / Demo123!</p>
                  <p>Admin: admin@nexlive.test / Demo123!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
