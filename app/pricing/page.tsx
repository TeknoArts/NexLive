import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-heading font-bold mb-4">Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include enterprise-grade security and sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Viewer Plan</CardTitle>
              <CardDescription>For individual viewers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Access to all live channels</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>VOD library access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>HD streaming quality</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Multi-device support</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="card-hover border-primary">
            <CardHeader>
              <CardTitle>Partner / Broadcaster</CardTitle>
              <CardDescription>For content creators and broadcasters</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Unlimited channels</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>VOD upload & management</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Monetization tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full">Contact Sales</Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For governments and large organizations</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Fully sovereign deployment</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>White-label solution</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Dedicated infrastructure</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>24/7 support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>SLA guarantees</span>
                </li>
              </ul>
              <Button className="w-full">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30">
          <CardContent className="p-8">
            <h2 className="text-3xl font-heading font-bold mb-4">Voucher-Based Monetization</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Perfect for markets with limited credit card penetration. NexLive supports prepaid voucher codes that can be distributed through retail networks, making premium streaming accessible across Africa and emerging markets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Purchase voucher codes in bulk</li>
                  <li>• Distribute through retail partners</li>
                  <li>• Users redeem codes for wallet credit</li>
                  <li>• Seamless payment experience</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Benefits:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No credit card required</li>
                  <li>• Cash-friendly payment method</li>
                  <li>• Broad market reach</li>
                  <li>• Secure and trackable</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
