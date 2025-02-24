// app/verify/page.tsx
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VerifyLanding() {
    const session = await auth()
    if (session?.user) {
      if (session?.user.role==="manufacturer") return redirect("/dashboard")
      if (session?.user.role!=="product_owner") return redirect("/")
    }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Authlink</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#support" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </a>
            </nav>
            <div className="flex gap-x-2">
                <Button asChild>
                    <Link href={"/signup"}>
                        Sign Up
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href={"/login"}>
                        Login
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1 mb-8 bg-background/50 backdrop-blur-sm">
              <span className="text-sm font-medium text-muted-foreground">
                Trusted by leading brands worldwide
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Verify Authenticity
              <br />
              <span className="text-4xl md:text-6xl text-muted-foreground">With a Simple Tap</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Instantly verify your luxury items, electronics, and branded goods with just your smartphone. 
              No apps required — tap and authenticate in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Smartphone className="mr-2"/> Start Verifying
              </Button>
              <Button variant="outline">
                Watch How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 text-center text-sm text-muted-foreground">
              <div>
                <div className="font-bold text-2xl text-foreground mb-1">100K+</div>
                Products Verified
              </div>
              <div>
                <div className="font-bold text-2xl text-foreground mb-1">50+</div>
                Brand Partners
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="font-bold text-2xl text-foreground mb-1">100%</div>
                Accuracy Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-none">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="rounded-full bg-primary/10 p-3 inline-block mb-4">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">1. Tap Your Phone</h3>
                  <p className="text-muted-foreground">
                    Hold your phone near the product's Authlink tag
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="rounded-full bg-primary/10 p-3 inline-block mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2. Instant Check</h3>
                  <p className="text-muted-foreground">
                    Our system verifies the product's authenticity in real-time
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="rounded-full bg-primary/10 p-3 inline-block mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3. Get Results</h3>
                  <p className="text-muted-foreground">
                    See immediate confirmation of your product's authenticity
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Trust Authlink?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Blockchain Security</h3>
                    <p className="text-muted-foreground">
                      Every verification is secured by unbreakable blockchain technology
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-Time Protection</h3>
                    <p className="text-muted-foreground">
                      Instant alerts if counterfeit products are detected
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Trusted by Brands</h3>
                    <p className="text-muted-foreground">
                      Used by leading luxury, electronics, and fashion brands worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Protected Categories</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <p className="font-medium">Luxury Goods</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <p className="font-medium">Electronics</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <p className="font-medium">Fashion</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <p className="font-medium">Collectibles</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Verify Your Products?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of product owners who trust Authlink to verify their valuable purchases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Start Verifying
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}